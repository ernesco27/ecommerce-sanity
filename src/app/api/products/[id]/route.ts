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
        "primary": {
          "url": primary.asset->url,
          "alt": primary.alt,
          "metadata": primary.asset->metadata
        },
        "gallery": gallery[]{ 
          "url": asset->url,
          "alt": alt,
          "metadata": asset->metadata
        }
      },
      "variants": variants[]->{ 
        _id,
        size,
        price,
        compareAtPrice,
        sku,
        "colorVariants": colorVariants[] {
          color,
          colorCode,
          stock,
          "images": images[] {
            "url": asset->url,
            "alt": alt,
            "metadata": asset->metadata
          }
        }
      },
      "reviews": reviews[]->{ 
        _id,
        rating,
        title,
        comment,
        author,
        verifiedPurchase,
        createdAt,
        helpful
      },
      "reviewSummary": {
        "averageRating": coalesce(round(select(
          count(reviews) > 0 => sum(reviews[].rating) / count(reviews),
          0
        ) * 10) / 10, 0),
        "totalReviews": count(reviews)
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
