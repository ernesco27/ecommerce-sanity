import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { client, writeClient } from "@/sanity/lib/client";
import { nanoid } from "nanoid";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";
    const sanityUserId = searchParams.get("userId");
    const status = searchParams.get("status") || "all";
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const page = parseInt(searchParams.get("page") || "0", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const start = page * pageSize;
    const end = start + pageSize;

    let baseFilter = '_type == "order"';
    let queryParams: Record<string, any> = {};

    if (!admin) {
      // User-restricted: require userId
      if (!sanityUserId) {
        return NextResponse.json(
          { error: "Missing userId parameter" },
          { status: 400 },
        );
      }
      // Verify that the requesting user owns these orders
      const user = await client.fetch(
        `*[_type == "user" && _id == $sanityUserId && clerkUserId == $clerkUserId][0]._id`,
        { sanityUserId, clerkUserId },
      );
      if (!user) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      baseFilter += ` && user._ref == $userId`;
      queryParams.userId = sanityUserId;
    }

    if (status !== "all") {
      baseFilter += ` && status == $status`;
      queryParams.status = status;
    }

    // Get total count for pagination
    const countQuery = `count(*[${baseFilter}])`;
    const totalOrders = await client.fetch(countQuery, queryParams);

    // Fetch paginated data
    const query = `*[${baseFilter}] | order(${sortField} ${sortOrder}) [${start}...${end}] {
      _id,
      orderNumber,
      createdAt,
      status,
      paymentStatus,
      total,
      tax,
      discount,
      subtotal,
      shippingCost,
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
          variantId,
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
        email,
      },
    }`;
    const orders = await client.fetch(query, queryParams);

    return NextResponse.json({ orders, totalOrders });
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
      paymentMethod = [
        { paymentMethod: "onDelivery", status: "not paid" },
        { paymentMethod: "paystack", status: "paid" },
      ],
      subtotal,
      total,
      customerEmail,
      paymentStatus,
      taxAmount,
      discountTotal,
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
        type: paymentMethod?.paymentMethod || "onDelivery",
        status: paymentMethod?.status || "pending",
      },
      subtotal,
      shippingCost: shippingMethod.price,
      tax: taxAmount,
      discount: discountTotal,
      total,
      status: "pending",
      paymentStatus: paymentStatus,
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
