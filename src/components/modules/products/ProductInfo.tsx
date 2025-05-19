import React from "react";

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

import ProductReview from "./ProductReview";
import Container from "@/components/custom/Container";
import { Product } from "../../../../sanity.types";
const ProductInfo = ({ product }: { product: Product }) => {
  console.log("product", product);

  return (
    <section>
      <Container>
        <div className="w-full ">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="flex justify-center">
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
                <p className="font-normal text-lg lg:text-xl">
                  {product.fullDescription
                    ? product.fullDescription
                    : product.description}
                </p>
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
                    <TableRow>
                      <TableCell className="font-medium text-lg lg:text-xl">
                        Material
                      </TableCell>
                      <TableCell className="text-lg lg:text-xl">
                        {product?.materialType}
                      </TableCell>
                    </TableRow>
                    {product.variants &&
                      product.variants.length > 0 &&
                      product.variants.map((variant) => (
                        <TableRow key={variant.id}>
                          <TableCell className="font-medium text-lg lg:text-xl">
                            {variant.name}
                          </TableCell>
                          <TableCell>
                            {variant.values?.map((value, index) => (
                              <span
                                className=" text-lg lg:text-xl"
                                key={value.id}
                              >
                                {value.value}
                                {index < (variant.values?.length || 0) - 1
                                  ? ", "
                                  : ""}
                              </span>
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}

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
                        {product.brand?.name}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="review" className="lg:px-10 ">
              <ProductReview product={product} />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </section>
  );
};

export default ProductInfo;
