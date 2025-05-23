import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = groq`*[_type == "category"] {
      _id,
      title,
      "slug": slug.current,
      "subcategories": subcategories[]-> {
        _id,
        name,
        "slug": slug.current
      },
      "productCount": count(*[_type == "product" && references(^._id)])
    }`;

    const categories = await client.fetch(query);

    return NextResponse.json(categories, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Error fetching categories", error: (error as Error).message },
      { status: 500 },
    );
  }
}
