"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Products from "@/components/modules/products/Products";
import axios from "axios";
import type { ProductsQueryResult } from "../../../../sanity.types";

interface FilterState {
  minPrice: number;
  maxPrice: number;
  selectedSizes: string[];
  selectedColors: string[];
  selectedCategories: string[];
}

const ProductsContainer = () => {
  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 500,
    maxPrice: 2000,
    selectedSizes: [],
    selectedColors: [],
    selectedCategories: [],
  });

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductsQueryResult[0][]>([]);
  const [filter, setFilter] = useState<string>("latest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  // Handler for updating filters
  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setPage(1); // Reset page when filters change
    setProducts([]); // Clear products when filters change
  };

  const lastProductElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  const fetchProducts = async (pageNumber: number) => {
    try {
      setLoading(true);
      const params = {
        filter,
        page: pageNumber,
        limit: 10,
        ...filters,
        selectedSizes: filters.selectedSizes.join(","),
        selectedColors: filters.selectedColors.join(","),
        selectedCategories: filters.selectedCategories.join(","),
      };

      const response = await axios.get("/api/products", { params });
      const newProducts = response.data;

      setProducts((prev) =>
        pageNumber === 1 ? newProducts : [...prev, ...newProducts],
      );
      setHasMore(newProducts.length === 10);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page, filters, filter]);

  return (
    <div>
      <Products
        filters={filters}
        onFilterChange={handleFilterChange}
        loading={loading}
        setLoading={setLoading}
        filter={filter}
        setFilter={setFilter}
        products={products}
        lastProductElementRef={lastProductElementRef}
        hasMore={hasMore}
      />
    </div>
  );
};

export default ProductsContainer;
