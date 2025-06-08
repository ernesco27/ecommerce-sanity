import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { client, writeClient } from "@/sanity/lib/client";
import { nanoid } from "nanoid";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the Sanity user ID from the query params
    const { searchParams } = new URL(request.url);
    const sanityUserId = searchParams.get("userId");

    if (!sanityUserId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 },
      );
    }

    // Verify that the requesting user owns these orders
    const user = await client.fetch(
      `*[_type == "user" && _id == $sanityUserId && clerkUserId == $clerkUserId][0]._id`,
      { sanityUserId, clerkUserId: userId },
    );

    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch orders for the user with all necessary details
    const orders = await client.fetch(
      `*[_type == "order" && user._ref == $userId] | order(createdAt desc) {
        _id,
        orderNumber,
        createdAt,
        status,
        total,
        "user": user->{
          _id,
          firstName,
          lastName,
        },
        "items": items[] {
          _key,
          quantity,
          subtotal,
          "product": product-> {
            _id,
            name,
            "images": {
              "primary": {
                "url": images.primary.asset->url,
                "alt": images.primary.alt
              }
            }
          },
          variant {
            size,
            price,
            color
            
          },
          
        },
         "shippingAddress": shippingAddress->{
          _id,
          fullName,
          addressLine1,
          addressLine2,
          city,
          state,
          postalCode,
          country,
          phone,
          email
        },
      }`,
      { userId: sanityUserId },
    );

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    // if (!userId) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

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

    interface OrderItem {
      _id: string;
      selectedVariant: {
        _id: string;
        color: string;
      };
      quantity: number;
    }

    interface VariantDoc {
      _id: string;
      colorVariants: Array<{
        _key: string;
        color: string;
        stock: number;
      }>;
    }

    interface InventoryDoc {
      _id: string;
      _type: "inventory";
      product: { _type: "reference"; _ref: string };
      variant: { _type: "reference"; _ref: string };
      quantity: number;
      stockStatus: "out_of_stock" | "low_stock" | "in_stock";
      stockMovements: Array<{
        _key: string;
        date: string;
        type: "order_fulfillment";
        quantity: number;
        order: { _type: "reference"; _ref: string };
        reference: string;
      }>;
    }

    // Batch stock updates for better performance
    const variantIds = items.map((item: OrderItem) => item.selectedVariant._id);

    // Fetch all variants in a single query
    const variantsQuery = `*[_type == "productVariant" && _id in $variantIds]{
      _id,
      colorVariants[] {
        _key,
        color,
        stock
      }
    }`;
    const variants = await writeClient.fetch<VariantDoc[]>(variantsQuery, {
      variantIds,
    });

    // Prepare batch operations
    const transaction = writeClient.transaction();
    const inventoryDocs: InventoryDoc[] = [];

    for (const item of items as OrderItem[]) {
      const { _id: productId, selectedVariant, quantity } = item;
      const variantDoc = variants.find(
        (v: VariantDoc) => v._id === selectedVariant._id,
      );

      if (!variantDoc) {
        console.error(`Variant not found: ${selectedVariant._id}`);
        continue;
      }

      const colorVariant = variantDoc.colorVariants.find(
        (cv) => cv.color === selectedVariant.color,
      );
      if (!colorVariant) {
        console.error(
          `Color variant not found for variant ${selectedVariant._id} and color ${selectedVariant.color}`,
        );
        continue;
      }

      const newStock = Math.max(0, (colorVariant.stock || 0) - quantity);

      // Add variant update to transaction
      transaction.patch(selectedVariant._id, {
        set: {
          [`colorVariants[_key=="${colorVariant._key}"].stock`]: newStock,
        },
      });

      // Prepare inventory document
      inventoryDocs.push({
        _id: uuidv4(), // Add _id for createIfNotExists
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

    // Execute all variant updates in a single transaction
    await transaction.commit();

    // Create all inventory documents
    if (inventoryDocs.length > 0) {
      await Promise.all(inventoryDocs.map((doc) => writeClient.create(doc)));
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
