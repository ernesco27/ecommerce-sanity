import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { nanoid } from "nanoid";
import { sendOrderConfirmationEmail } from "@/lib/email";

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
      paymentMethod,
      subtotal,
      total,
      customerEmail,
    } = body;

    // Create shipping address in Sanity if it doesn't exist
    let shippingAddressRef = shippingAddress._id;
    if (!shippingAddressRef) {
      const newShippingAddress = await client.create({
        _type: "address",
        ...shippingAddress,
        user: {
          _type: "reference",
          _ref: userId,
        },
      });
      shippingAddressRef = newShippingAddress._id;
    }

    // Create billing address in Sanity if it doesn't exist
    let billingAddressRef = billingAddress._id;
    if (!billingAddressRef) {
      const newBillingAddress = await client.create({
        _type: "address",
        ...billingAddress,
        user: {
          _type: "reference",
          _ref: userId,
        },
      });
      billingAddressRef = newBillingAddress._id;
    }

    const orderNumber = nanoid(10).toUpperCase();

    // Create the order
    const order = await client.create({
      _type: "order",
      orderNumber,
      user: {
        _type: "reference",
        _ref: userId,
      },
      items: items.map((item: any) => ({
        _type: "object",
        product: {
          _type: "reference",
          _ref: item._id,
        },
        variant: {
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
        type: paymentMethod.paymentMethod,
        lastFourDigits: paymentMethod.cardNumber?.slice(-4),
        cardType: "Credit Card", // You might want to determine this based on the card number
      },
      subtotal,
      shippingCost: shippingMethod.price,
      tax: 0, // You might want to calculate this based on your business rules
      total,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

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
    // TODO: Create payment intent with Stripe

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
