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

// // PUT /api/company
// export async function PUT(request: Request) {
//   try {
//     const body = await request.json();

//     // Validate required fields
//     const requiredFields = ["businessName", "email", "phone", "address"];
//     for (const field of requiredFields) {
//       if (!body[field]) {
//         return NextResponse.json(
//           { error: `Missing required field: ${field}` },
//           { status: 400 },
//         );
//       }
//     }

//     // Validate address fields
//     const requiredAddressFields = [
//       "street",
//       "city",
//       "state",
//       "postalCode",
//       "country",
//     ];
//     for (const field of requiredAddressFields) {
//       if (!body.address[field]) {
//         return NextResponse.json(
//           { error: `Missing required address field: ${field}` },
//           { status: 400 },
//         );
//       }
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(body.email)) {
//       return NextResponse.json(
//         { error: "Invalid email format" },
//         { status: 400 },
//       );
//     }

//     // Create or update company settings document
//     const companyData = {
//       _type: "companySettings",
//       _id: COMPANY_SETTINGS_ID,
//       ...body,
//     };

//     const result = await client.createOrReplace(companyData);

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error("Error updating company data:", error);
//     return NextResponse.json(
//       { error: "Failed to update company data" },
//       { status: 500 },
//     );
//   }
// }

// // DELETE method is intentionally not implemented as this is a singleton document
