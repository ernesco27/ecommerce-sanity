import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { NextResponse } from "next/server";

// Define the product query with all necessary fields
const productsQuery = groq`*[_type == "product"] {
  _id,
  _createdAt,
  name,
  "slug": slug.current,
  description,
  fullDescription,
  status,
  visibility {
    isVisible,
    publishDate,
    unpublishDate
  },
  "category": category->{ 
    _id, 
    title, 
    "slug": slug.current,
    "subcategories": subcategories[]->{ 
      _id, 
      name, 
      "slug": slug.current 
    }
  },
  "additionalCategories": additionalCategories[]->{ 
    _id, 
    title, 
    "slug": slug.current 
  },
  "brand": brand->{ 
    _id, 
    name, 
    "slug": slug.current 
  },
  "images": {
    "primary": {
      "url": primary.asset->url,
      "alt": primary.alt,
      "metadata": primary.asset->metadata
    },
    "gallery": gallery[]{ 
      "url": asset->url,
      "alt": alt,
      "metadata": asset->metadata,
      displayOrder
    }
  },
  "variants": variants[]->{ 
    _id,
    sku,
    "attributes": attributes[]{
      "name": attribute->name,
      "code": attribute->code,
      value
    },
    pricing {
      basePrice,
      salePrice,
      validFrom,
      validTo
    },
    inventory {
      quantity,
      lowStockThreshold,
      reserved,
      status,
      "warehouse": warehouse->name
    },
    "images": {
      "primary": {
        "url": primary.asset->url,
        "alt": primary.alt,
        "metadata": primary.asset->metadata
      },
      "gallery": gallery[]{ 
        "url": asset->url,
        "alt": alt,
        "metadata": asset->metadata,
        displayOrder
      }
    },
    dimensions {
      weight,
      length,
      width,
      height
    }
  },
  "attributes": attributes[]->{ 
    _id,
    name,
    code,
    values
  },
  "reviews": reviews[]->{ 
    _id,
    reviewTitle,
    rating,
    reviewDetails,
    verifiedPurchase,
    helpfulVotes,
    reviewDate,
    "user": user->{ 
      firstName,
      lastName,
      email
    }
  },
  seo {
    metaTitle,
    metaDescription,
    keywords,
    canonicalUrl,
    structuredData {
      "brand": brand->{
        name,
        "logo": logo.asset->url
      },
      "category": category->title,
      manufacturer
    }
  },
  taxInfo {
    taxCategory,
    taxRate,
    hsnCode
  }
} | order(_createdAt desc)`;

export async function GET(request: Request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const isVisible = searchParams.get("visible") === "true";

    // Modify query based on parameters
    let query = productsQuery;
    let filters: string[] = [];

    if (category) {
      filters.push(`category->slug.current == "${category}"`);
    }
    if (status) {
      filters.push(`status == "${status}"`);
    }
    if (isVisible !== undefined) {
      filters.push(`visibility.isVisible == ${isVisible}`);
    }

    // Apply filters if any exist
    if (filters.length > 0) {
      const filterString = filters.join(" && ");
      query = groq`*[_type == "product" && ${filterString}]${query.substring(
        query.indexOf("{"),
      )}`;
    }

    // Fetch products from Sanity
    const products = await client.fetch(query);

    // Apply limit if specified
    const limitedProducts = limit ? products.slice(0, limit) : products;

    return NextResponse.json(limitedProducts, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products", error: (error as Error).message },
      { status: 500 },
    );
  }
}
