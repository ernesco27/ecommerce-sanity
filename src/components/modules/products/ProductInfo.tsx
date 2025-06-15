import React from "react";
import { PortableText } from "@portabletext/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Container from "@/components/custom/Container";
import { Product, ProductVariant } from "../../../../sanity.types";
import ProductReview from "./ProductReview";

// Wrapper component to handle type conversion
const ProductReviewWrapper = ({ product }: { product: Product }) => {
  if (!product.reviews)
    return <ProductReview product={{ ...product, reviews: [] }} />;

  // The reviews are already expanded by the GROQ query
  return <ProductReview product={product as any} />;
};

const ProductInfo = ({ product }: { product: Product }) => {
  // Get unique sizes and colors
  const sizes = Array.from(
    new Set(
      product.variants
        ?.map((variantRef) => {
          const variant = variantRef as unknown as ProductVariant;
          return variant.size;
        })
        .filter(Boolean),
    ),
  ).join(", ");

  const colors = Array.from(
    new Set(
      product.variants
        ?.flatMap((variantRef) => {
          const variant = variantRef as unknown as ProductVariant;
          return variant.colorVariants?.map((c) => c.color);
        })
        .filter(Boolean),
    ),
  ).join(", ");

  // Table rows data
  const tableData = [
    { feature: "Material Type", description: product.materialType || "N/A" },
    { feature: "Size", description: sizes || "N/A" },
    { feature: "Color", description: colors || "N/A" },
    { feature: "Country of Origin", description: "Ghana" },
    { feature: "Brand", description: product.brand?.name || "N/A" },
  ];

  return (
    <section>
      <Container>
        <div className="w-full">
          <Tabs defaultValue="description">
            <TabsList className="flex-center w-full">
              <TabsTrigger className="text-lg lg:text-2xl" value="description">
                Description
              </TabsTrigger>
              <TabsTrigger
                className="text-lg lg:text-2xl"
                value="additional-info"
              >
                Additional Information
              </TabsTrigger>
              <TabsTrigger className="text-lg lg:text-2xl" value="review">
                Review
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="lg:px-10">
              <div>
                <div className="font-normal text-lg lg:text-xl">
                  {product.fullDescription ? (
                    <PortableText value={product.fullDescription} />
                  ) : (
                    <p>{product.description || "No description available"}</p>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="additional-info" className="lg:px-10">
              <Table className="my-4">
                <TableHeader className="bg-primary-500">
                  <TableRow>
                    <TableHead className="w-[190px] lg:w-[300px] text-black text-lg lg:text-xl">
                      Feature
                    </TableHead>
                    <TableHead className="text-black text-lg lg:text-xl">
                      Description
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow key={row.feature}>
                      <TableCell className="font-medium text-lg lg:text-xl">
                        {row.feature}
                      </TableCell>
                      <TableCell className="text-lg lg:text-xl capitalize">
                        {row.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="review" className="lg:px-10">
              <ProductReviewWrapper product={product} />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </section>
  );
};

export default ProductInfo;
