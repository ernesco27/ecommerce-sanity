import React from "react";
import { PortableText } from "@portabletext/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Container from "@/components/custom/Container";
import { Product, ProductVariant } from "../../../../sanity.types";
import ProductReview from "./ProductReview";

const ProductInfo = ({ product }: { product: Product }) => {
  return (
    <section>
      <Container>
        <div className="w-full ">
          <Tabs defaultValue="description" className="w-full  ">
            <TabsList className="flex justify-center w-full">
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
              <div>
                <Table>
                  <TableHeader className="bg-primary-300">
                    <TableRow>
                      <TableHead className="w-[190px] text-black text-lg lg:text-xl">
                        Feature
                      </TableHead>
                      <TableHead className="text-black text-lg lg:text-xl">
                        Description
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.variants &&
                      product.variants.length > 0 &&
                      product.variants.map((variantRef) => {
                        const variant = variantRef as unknown as ProductVariant;
                        return (
                          <TableRow key={variant._id}>
                            <TableCell className="font-medium text-lg lg:text-xl">
                              {variant.size}
                            </TableCell>
                            <TableCell className="text-lg lg:text-xl">
                              {variant.colorVariants?.map((color, index) => (
                                <span key={color._key}>
                                  {color.color}
                                  {index <
                                  (variant.colorVariants?.length || 0) - 1
                                    ? ", "
                                    : ""}
                                </span>
                              ))}
                            </TableCell>
                          </TableRow>
                        );
                      })}

                    <TableRow>
                      <TableCell className="font-medium text-lg lg:text-xl">
                        Country of Origin
                      </TableCell>
                      <TableCell className="text-lg lg:text-xl">
                        Ghana
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-lg lg:text-xl">
                        Brand
                      </TableCell>
                      <TableCell className="text-lg lg:text-xl">
                        {product.brand?._ref || "N/A"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="review" className="lg:px-10 ">
              <ProductReview product={product as any} />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </section>
  );
};

export default ProductInfo;
