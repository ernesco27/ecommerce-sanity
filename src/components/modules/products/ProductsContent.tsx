import { ShoppingBasket } from "lucide-react";
import React from "react";

import ProductCard from "@/components/custom/ProductCard";
import type { ProductsQueryResult } from "../../../../sanity.types";

const ProductsContent = ({
  products,
}: {
  products: ProductsQueryResult[0][];
}) => {
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
      {products?.map((item) => <ProductCard key={item._id} item={item} />)}
    </div>
  );
};

export default ProductsContent;
