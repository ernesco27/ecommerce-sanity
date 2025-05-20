import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/client";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Validate file sizes
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Maximum size is 5MB` },
          { status: 400 },
        );
      }
    }

    // Upload each file to Sanity
    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const fileBuffer = await file.arrayBuffer();
        const fileAsset = await writeClient.assets.upload(
          "image",
          Buffer.from(fileBuffer),
        );

        return {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: fileAsset._id,
          },
        };
      }),
    );

    return NextResponse.json({
      success: true,
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload images",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
