"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Products from "@/components/modules/products/Products";
import axios from "axios";
import type { ProductsQueryResult } from "../../../../sanity.types";
import { useFilters, FilterState } from "@/hooks/useFilters";

const ProductsContainer = () => {
  const { filters, updateFilters } = useFilters();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductsQueryResult[0][]>([]);
  const [filter, setFilter] = useState<string>("latest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  // Use a stable stringified version of filters for useEffect dependencies
  const filtersString = JSON.stringify(filters);

  // Track previous filtersString and filter to prevent infinite reset loop
  const prevFiltersString = useRef(filtersString);
  const prevFilter = useRef(filter);

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
      const params: any = {
        filter,
        page: pageNumber,
        limit: 10,
      };
      if (filters.selectedCategories && filters.selectedCategories.length > 0) {
        params.selectedCategories = filters.selectedCategories.join(",");
      }
      if (filters.selectedSizes && filters.selectedSizes.length > 0) {
        params.selectedSizes = filters.selectedSizes.join(",");
      }
      if (filters.selectedColors && filters.selectedColors.length > 0) {
        params.selectedColors = filters.selectedColors.join(",");
      }
      if (filters.minPrice !== undefined) {
        params.minPrice = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        params.maxPrice = filters.maxPrice;
      }
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

  // Reset page and products only if filtersString or filter actually change
  useEffect(() => {
    if (
      prevFiltersString.current !== filtersString ||
      prevFilter.current !== filter
    ) {
      setPage(1);
      setProducts([]);
      prevFiltersString.current = filtersString;
      prevFilter.current = filter;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersString, filter]);

  // Fetch products when page, filters, or sort order change
  useEffect(() => {
    fetchProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filtersString, filter]);

  return (
    <div>
      <Products
        filters={filters}
        onFilterChange={updateFilters}
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
