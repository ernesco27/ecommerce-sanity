import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export async function GET() {
  try {
    const taxSettings = await client.fetch(
      groq`*[_type == "taxSettings"][0]{
        isEnabled,
        defaultRate,
        taxRules,
        exemptCategories[]->{_id},
        exemptProducts[]->{_id},
        taxIncluded,
        displayTax
      }`,
    );

    if (!taxSettings) {
      return NextResponse.json(
        { success: false, error: "Tax settings not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, taxSettings });
  } catch (error) {
    console.error("Error fetching tax settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tax settings" },
      { status: 500 },
    );
  }
}
