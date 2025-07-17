import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { message: "Product slug is required." },
      { status: 400 },
    );
  }

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
      
              "relatedProducts": *[_type == "product" && slug.current != $slug && count(tags[@ in ^.tags]) > 0] | order(_createdAt desc) [0...4] {
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
        }
       
      }`,
      { slug },
    );

    if (!product) throw new NotFoundError("Product");

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
