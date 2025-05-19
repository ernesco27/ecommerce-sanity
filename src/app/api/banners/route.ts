import { client } from "@/lib/client";
import { Banner } from "../../../../sanity.types";
import { NextResponse } from "next/server";

// Extend the Banner type to include the fields from the GROQ projection
type BannerResponse = Banner & {
  imageUrl: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "hero";
  const location = searchParams.get("location");

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error("Missing Sanity project ID");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  try {
    // Base query without location filter
    const baseQuery = `*[_type == "banner" && bannerType == $type && isActive == true && (startDate == null || startDate <= now()) && (endDate == null || endDate >= now())]`;

    // Add location filter only if location is provided
    const query = location
      ? `${baseQuery}[slug.current == $location] | order(displayOrder asc) {
          _id,
          _type,
          title,
          subTitle,
          description,
          "imageUrl": image.asset->url,
          "alt": image.alt,
          slug,
          link,
          buttonText,
          displayOrder,
          bannerType,
          textColor,
          backgroundColor
        }`
      : `${baseQuery} | order(displayOrder asc) {
          _id,
          _type,
          title,
          subTitle,
          description,
          "imageUrl": image.asset->url,
          "alt": image.alt,
          slug,
          link,
          buttonText,
          displayOrder,
          bannerType,
          textColor,
          backgroundColor
        }`;

    // Only include location in params if it exists
    const params = {
      type,
      ...(location && { location }),
    };

    const banners = await client.fetch<BannerResponse[]>(query, params);

    if (!banners || banners.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { message: "Error fetching banners", error: (error as Error).message },
      { status: 500 },
    );
  }
}
