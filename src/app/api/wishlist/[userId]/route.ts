import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 },
      );
    }

    // First get the Sanity user ID from the Clerk user ID
    const sanityUser = await client.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId: userId },
    );

    if (!sanityUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch wishlist items for the user with all necessary details
    const wishlistItems = await client.fetch(
      `*[_type == "productWishlist" && user._ref == $sanityUserId] | order(createdAt desc) {
        _id,
        _key,
        addedAt,
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
          color,
          stock
        }
      }`,
      { sanityUserId: sanityUser._id },
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
