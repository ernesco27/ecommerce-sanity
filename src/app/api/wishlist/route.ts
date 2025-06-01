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

    // Verify that the requesting user owns these wishlist items
    const user = await client.fetch(
      `*[_type == "user" && _id == $sanityUserId && clerkUserId == $clerkUserId][0]._id`,
      { sanityUserId, clerkUserId: userId },
    );

    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch wishlist items for the user with all necessary details
    const wishlistItems = await client.fetch(
      `*[_type == "productWishlist" && user._ref == $userId] | order(createdAt desc) {
        _id,
        _key,
        createdAt,
        quantity,
    
        "user": user->{
          _id,
          firstName,
          lastName
        },
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
        }
      }`,
      { userId: sanityUserId },
    );

    return NextResponse.json(wishlistItems);
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist items" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { product, selectedVariant, selectedColor, quantity, imageUrl } =
      body;

    // Validate required fields
    if (!product?._id) {
      return NextResponse.json(
        { error: "Missing required product data" },
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

    // Check if the product already exists in the user's wishlist
    const existingWishlistItem = await client.fetch(
      `*[_type == "productWishlist" && user._ref == $sanityUserId && product._ref == $productId][0]`,
      {
        sanityUserId,
        productId: product._id,
      },
    );

    if (existingWishlistItem) {
      return NextResponse.json(
        { error: "Product already in wishlist" },
        { status: 400 },
      );
    }

    // Create the wishlist item
    const wishlistItem = await writeClient.create({
      _type: "productWishlist",
      _key: uuidv4(),
      product: {
        _type: "reference",
        _ref: product._id,
      },
      user: {
        _type: "reference",
        _ref: sanityUserId,
      },
      variant: {
        _key: uuidv4(),

        variantId: selectedVariant._id,
        color: selectedColor,
        size: selectedVariant.size,
        price: selectedVariant.price,
      },
      quantity,

      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ wishlistItem }, { status: 201 });
  } catch (error) {
    console.error("Error creating wishlist item:", error);
    return NextResponse.json(
      { error: "Failed to create wishlist item" },
      { status: 500 },
    );
  }
}
