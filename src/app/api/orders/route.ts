import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient } from "@/sanity/lib/client";
import { nanoid } from "nanoid";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      items,
      shippingAddress,
      billingAddress,
      shippingMethod,
      paymentMethod = { paymentMethod: "delivery", status: "pending" },
      subtotal,
      total,
      customerEmail,
    } = body;

    // Validate required fields
    if (
      !items?.length ||
      !shippingAddress ||
      !billingAddress ||
      !shippingMethod
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // First get or create the Sanity user document
    const userQuery = `*[_type == "user" && clerkUserId == $userId][0]._id`;
    let sanityUserId = await writeClient.fetch(userQuery, { userId });

    if (!sanityUserId) {
      // Create the user document if it doesn't exist
      const newUser = await writeClient.create({
        _type: "user",
        clerkUserId: userId,
        createdAt: new Date().toISOString(),
      });
      sanityUserId = newUser._id;
    }

    // Create shipping address in Sanity if it doesn't exist
    let shippingAddressRef = shippingAddress._id;
    if (!shippingAddressRef) {
      const newShippingAddress = await writeClient.create({
        _type: "address",
        ...shippingAddress,
        user: {
          _type: "reference",
          _ref: sanityUserId,
        },
      });
      shippingAddressRef = newShippingAddress._id;
    }

    // Create billing address in Sanity if it doesn't exist
    let billingAddressRef = billingAddress._id;
    if (!billingAddressRef) {
      const newBillingAddress = await writeClient.create({
        _type: "address",
        ...billingAddress,
        user: {
          _type: "reference",
          _ref: sanityUserId,
        },
      });
      billingAddressRef = newBillingAddress._id;
    }

    const orderNumber = nanoid(10).toUpperCase();

    // Create the order
    const order = await writeClient.create({
      _type: "order",
      orderNumber,
      user: {
        _type: "reference",
        _ref: sanityUserId,
      },
      items: items.map((item: any) => ({
        _key: uuidv4(),
        _type: "object",
        product: {
          _type: "reference",
          _ref: item._id,
        },
        variant: {
          _key: uuidv4(),
          variantId: item.selectedVariant._id,
          color: item.selectedVariant.color,
          size: item.selectedVariant.size,
          price: item.selectedVariant.price,
        },
        quantity: item.quantity,
        subtotal: item.quantity * item.selectedVariant.price,
      })),
      shippingAddress: {
        _type: "reference",
        _ref: shippingAddressRef,
      },
      billingAddress: {
        _type: "reference",
        _ref: billingAddressRef,
      },
      shippingMethod: {
        id: shippingMethod.id,
        name: shippingMethod.name,
        price: shippingMethod.price,
        estimatedDays: shippingMethod.estimatedDays,
      },
      paymentMethod: {
        type: paymentMethod?.paymentMethod || "delivery",
        status: paymentMethod?.status || "pending",
      },
      subtotal,
      shippingCost: shippingMethod.price,
      tax: 0,
      total,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Update stock levels for each ordered item
    for (const item of items) {
      const { _id: productId, selectedVariant, quantity } = item;

      // Get the current variant document to find the color variant
      const variantQuery = `*[_type == "productVariant" && _id == $variantId][0]{
        colorVariants[color == $color]{
          _key,
          stock
        }
      }`;
      const variantDoc = await writeClient.fetch(variantQuery, {
        variantId: selectedVariant._id,
        color: selectedVariant.color,
      });

      if (!variantDoc?.colorVariants?.[0]) {
        console.error(
          `Color variant not found for variant ${selectedVariant._id} and color ${selectedVariant.color}`,
        );
        continue;
      }

      const colorVariant = variantDoc.colorVariants[0];
      const newStock = Math.max(0, (colorVariant.stock || 0) - quantity);

      // Update the stock quantity
      await writeClient
        .patch(selectedVariant._id)
        .set({
          [`colorVariants[_key=="${colorVariant._key}"].stock`]: newStock,
        })
        .commit();

      // Record the stock movement in inventory
      await writeClient.create({
        _type: "inventory",
        product: { _type: "reference", _ref: productId },
        variant: { _type: "reference", _ref: selectedVariant._id },
        quantity: newStock,
        stockStatus:
          newStock === 0
            ? "out_of_stock"
            : newStock < 5
              ? "low_stock"
              : "in_stock",
        stockMovements: [
          {
            _key: uuidv4(),
            date: new Date().toISOString(),
            type: "order_fulfillment",
            quantity: -quantity,
            order: { _type: "reference", _ref: order._id },
            reference: orderNumber,
          },
        ],
      });
    }

    // Send order confirmation email
    if (customerEmail) {
      await sendOrderConfirmationEmail(customerEmail, {
        orderNumber,
        customerName: shippingAddress.fullName,
        items: items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          variant: {
            color: item.selectedVariant.color,
            size: item.selectedVariant.size,
            price: item.selectedVariant.price,
          },
        })),
        shippingAddress,
        shippingMethod,
        subtotal,
        total,
      });
    }

    // TODO: Update inventory

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
