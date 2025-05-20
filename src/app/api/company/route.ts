import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

// Singleton document ID for company settings
const COMPANY_SETTINGS_ID = "companySettings";

// GET /api/company
export async function GET() {
  try {
    const query = groq`*[_type == "companySettings"][0] {
      businessName,
      legalName,
      taxId,
      email,
      phone,
      alternativePhone,
      address {
        street,
        city,
        state,
        postalCode,
        country
      },
      logo {
        asset->{
          url,
          metadata {
            dimensions {
              width,
              height
            }
          }
        },
        alt
      },
      favicon {
        asset->{ url }
      },
      brandColors {
        primary,
        secondary
      },
      socialMedia {
        facebook,
        instagram,
        twitter,
        linkedin,
        youtube
      },
      businessHours {
        weekday,
        weekend,
        holidays,
        timeZone
      },
      currency,
      languages,
      metaDescription
    }`;

    const companyData = await client.fetch(query);

    if (!companyData) {
      return NextResponse.json(
        { error: "Company settings not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(companyData);
  } catch (error) {
    console.error("Error fetching company data:", error);
    return NextResponse.json(
      { error: "Failed to fetch company data" },
      { status: 500 },
    );
  }
}
