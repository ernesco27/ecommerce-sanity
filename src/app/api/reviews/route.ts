import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reviewTitle, rating, reviewDetails, productId, userId, images } =
      body;

    console.log("body:", body);

    // First get the Sanity user document ID
    const userQuery = `*[_type == "user" && clerkUserId == $userId][0]._id`;
    const sanityUserId = await writeClient.fetch(userQuery, { userId });

    if (!sanityUserId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create the review document in Sanity
    const review = await writeClient.create({
      _type: "productReview",
      reviewTitle,
      rating,
      reviewDetails,
      product: productId
        ? {
            _type: "reference",
            _ref: productId,
          }
        : undefined,
      user: {
        _type: "reference",
        _ref: sanityUserId,
      },
      status: "pending",
      reviewDate: new Date().toISOString(),
      verifiedPurchase: false,
    });

    // Update the product document to include the new review reference
    if (productId) {
      await writeClient
        .patch(productId)
        .setIfMissing({ reviews: [] })
        .append("reviews", [
          {
            _type: "reference",
            _ref: review._id,
          },
        ])
        .commit();
    }

    // If there are images, create reviewImage documents and link them
    if (images && images.length > 0) {
      const reviewImages = await Promise.all(
        images.map(async (image: any) => {
          const reviewImage = await writeClient.create({
            _type: "reviewImage",
            title: `Review image for review ${review._id}`,
            images: [image],
          });
          return reviewImage._id;
        }),
      );

      // Update the review with image references
      await writeClient
        .patch(review._id)
        .set({
          images: reviewImages.map((id) => ({
            _type: "reference",
            _ref: id,
          })),
        })
        .commit();
    }

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      {
        error: "Failed to create review",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
