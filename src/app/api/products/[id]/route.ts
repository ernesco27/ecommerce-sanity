import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;

    // Use the same query structure as the products list but filter by ID
    const query = groq`*[_type == "product" && _id == "${id}"][0] {
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
    }`;

    const product = await client.fetch(query);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(product, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Error fetching product", error: (error as Error).message },
      { status: 500 },
    );
  }
}
