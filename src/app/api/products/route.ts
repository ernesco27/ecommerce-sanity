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
  price,
  salesPrice,
  sku,
  shippingDimensions,
  taxInfo,
  "baseStock": count(variants[]->.variantStocks[].stock),
  isAvailable,
  featured,
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
  "brand": brand->{ 
    _id, 
    name, 
    "slug": slug.current 
  },
  "images": images[]->{ 
    _id,
    title,
    "urls": images[].asset->url,
    "altText": altText
  },
  "variants": variants[]->{ 
    _id,
    size,
    price,
    salesPrice,
    "stocks": variantStocks[] {
      color,
      "hexCode": hexCode.hex,
      stock,
      "images": images[].asset->url
    }
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
    },
    "images": images[]->{ 
      title,
      "urls": images[].asset->url,
      altText
    }
  },
  seo {
    metaTitle,
    metaDescription,
    keywords
  }
} | order(_createdAt desc)`;

export async function GET(request: Request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const featured = searchParams.get("featured") === "true";
    const category = searchParams.get("category");

    // Modify query based on parameters
    let query = productsQuery;
    if (featured) {
      query = groq`*[_type == "product" && featured == true]${query.substring(
        query.indexOf("{"),
      )}`;
    }
    if (category) {
      query = groq`*[_type == "product" && category->slug.current == "${category}"]${query.substring(
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
