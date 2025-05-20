import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;

    // Use the same query structure as the products list but filter by ID
    const query = groq`*[_type == "product" && _id == $id][0] {
      _id,
      _createdAt,
      name,
      "slug": slug.current,
      description,
      fullDescription,
      materialType,
      status,
      visibility {
        isVisible,
        publishDate,
        unpublishDate
      },
      "category": category->{ 
        _id, 
        title, 
        "slug": slug.current
      },
      "subcategories": subcategory[]->{ 
        _id, 
        name, 
        "slug": slug.current,
        "parentCategory": parentCategory->{ 
          _id,
          title,
          "slug": slug.current
        }
      },
      "brand": brand->{ 
        _id, 
        name, 
        "slug": slug.current 
      },
      "images": {
        "primary": images.primary{
          "url": asset->url,
          "alt": alt,
          "lqip": asset->metadata.lqip,
          "dimensions": asset->metadata.dimensions
        },
        "gallery": images.gallery[]{
          "url": asset->url,
          "alt": alt,
          "lqip": asset->metadata.lqip,
          "dimensions": asset->metadata.dimensions
        }
      },
      "variants": variants[]->{ 
        _id,
        size,
        price,
        compareAtPrice,
        sku,
        colorVariants[] {
          color,
          colorCode,
          stock,
          "images": images[]{
            "url": asset->url,
            "alt": alt,
            "lqip": asset->metadata.lqip,
            "dimensions": asset->metadata.dimensions
          }
        }
      },
      "reviews": reviews[]->{
        _id,
        _createdAt,
        reviewTitle,
        reviewDetails,
        rating,
        verifiedPurchase,
        "user": user->{
          _id,
          firstName,
          lastName,
          email,
          isEmailVerified,
          "photo": photo.asset->
        },
        "images": images[]->{
          _id,
          title,
          altText,
          "images": images[]{
            "asset": {
              "url": asset->url
            }
          }
        }
      },
      seo {
        metaTitle,
        metaDescription,
        keywords,
        canonicalUrl
      },
      taxInfo {
        taxCategory,
        taxRate,
        hsnCode
      },
      "relatedProducts": relatedProducts[]->{ 
        _id,
        name,
        "slug": slug.current,
        "primaryImage": images.primary{
          "url": asset->url,
          alt,
          "lqip": asset->metadata.lqip
        },
        "pricing": {
          "min": coalesce((variants[]->price)[0], 0),
          "max": coalesce((variants[]->price)[-1], 0)
        }
      }
    }`;

    // Fetch product from Sanity
    const product = await client.fetch(query, { id });

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
