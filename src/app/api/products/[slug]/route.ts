import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = await params;

  try {
    const product = await client.fetch(
      groq`*[_type == "product" && slug.current == $slug][0]{
        _id,
        _createdAt,
        name,
        "slug": slug.current,
        description,
        fullDescription,
        materialType,
        status,
        featured,
        tags,
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
            title
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
            alt,
            "lqip": asset->metadata.lqip,
            "dimensions": asset->metadata.dimensions
          },
          "gallery": images.gallery[]{
            "url": asset->url,
            alt,
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
              alt,
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
        "relatedProducts": relatedProducts[]->{
          _id,
          name,
          "slug": slug.current,
          "primaryImage": images.primary{
            "url": asset->url,
            alt,
            "lqip": asset->metadata.lqip
          }
        },
       
      }`,
      { slug },
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
