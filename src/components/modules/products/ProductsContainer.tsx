"use client";

import React, { useEffect, useState } from "react";
import Products from "@/components/modules/products/Products";
import axios from "axios";
import type { ProductsQueryResult } from "../../../../sanity.types";

const ProductsContainer = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductsQueryResult[0][]>([]);
  const [filter, setFilter] = useState<string>("latest");

  //API CALL

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      await axios
        .get("/api/products", {
          params: {
            filter: filter,
            minPrice: minPrice,
            maxPrice: maxPrice,
          },
        })
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getProducts();
  }, [minPrice, maxPrice]);

  return (
    <div>
      <Products
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        loading={loading}
        setLoading={setLoading}
        filter={filter}
        setFilter={setFilter}
        products={products}
      />
    </div>
  );
};

export default ProductsContainer;
