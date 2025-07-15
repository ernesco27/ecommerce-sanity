import { ShoppingBasket } from "lucide-react";
import React from "react";

import ProductCard from "@/components/custom/ProductCard";
import type { Product } from "../../../../sanity.types";
import Reveal from "@/components/custom/Reveal";

interface ProductsContentProps {
  products: Product[];
  lastProductElementRef: (node: HTMLElement | null) => void;
}

const ProductsContent = ({
  products,
  lastProductElementRef,
}: ProductsContentProps) => {
  if (products?.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-20 px-20 w-full">
        <ShoppingBasket className="font-bold" size="50" />
        <h3 className="text-xl">No Product Found</h3>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4 flex-wrap p-4">
      {products?.map((item, index) => {
        if (products.length === index + 1) {
          return (
            <Reveal key={item._id}>
              <div key={item._id} ref={lastProductElementRef}>
                <ProductCard item={item} />
              </div>
            </Reveal>
          );
        } else {
          return (
            <Reveal key={item._id}>
              <ProductCard key={item._id} item={item} />
            </Reveal>
          );
        }
      })}
    </div>
  );
};

export default ProductsContent;
