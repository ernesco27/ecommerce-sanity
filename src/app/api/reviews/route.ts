import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reviewTitle, rating, reviewDetails, productId, userId, images } =
      body;

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
      user: userId
        ? {
            _type: "reference",
            _ref: userId,
          }
        : undefined,
      status: "pending",
      reviewDate: new Date().toISOString(),
      verifiedPurchase: false,
    });

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
