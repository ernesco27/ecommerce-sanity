import { NextResponse } from "next/server";
import { Page } from "../../../../sanity.types";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    const pages = await client.fetch<
      Page[]
    >(`*[_type == "page" && !(_id in path("drafts.**"))] {
      _id,
      name,
      title,
      slug,
      link,
      description,
      "image": image.asset->url,
      content,
      pageType,
      sections[] {
        sectionTitle,
        sectionContent[] {
          _type,
          children[] {
            _type,
            text,
            marks
          }
        }
      }
    }`);

    // Return the pages array directly since that's what the frontend expects
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 },
    );
  }
}
