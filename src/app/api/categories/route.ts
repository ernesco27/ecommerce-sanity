import { NextResponse } from "next/server";
import { Category } from "../../../../sanity.types";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    const categories = await client.fetch<Category[]>(`*[_type == "category"] {
      _id,
      title,
      slug,
      description,
      "image": image.asset->url,
      subcategories[]->{
        _id,
        name,
        slug,
        description,
        "image": image.asset->url
      }
    }`);

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
