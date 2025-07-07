"use client";

import Container from "@/components/custom/Container";
import Row from "@/components/custom/Row";
import React from "react";
import ProductsSidebarLeft from "@/components/modules/products/ProductsSidebarLeft";
import ProductsMainContent from "@/components/modules/products/ProductsMainContent";
import type { ProductsQueryResult } from "../../../../sanity.types";
import { useFilters, FilterState } from "@/hooks/useFilters";

// interface FilterState {
//   minPrice: number;
//   maxPrice: number;
//   selectedSizes: string[];
//   selectedColors: string[];
//   selectedCategories: string[];
// }

interface ProductsProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  filter: string;
  setFilter: (v: string) => void;
  products: ProductsQueryResult[0][];
  lastProductElementRef: (node: HTMLElement | null) => void;
  hasMore: boolean;
  className?: string;
}

const Products = ({
  filters,
  onFilterChange,
  loading,
  setLoading,
  filter,
  setFilter,
  products,
  lastProductElementRef,
  hasMore,
  className,
}: ProductsProps) => {
  // Define default/fallback values for the slider
  const MIN_PRICE = 500;
  const MAX_PRICE = 5000;

  return (
    <section className=" flex background-light800_dark100  relative ">
      {/* sidebar */}
      <ProductsSidebarLeft
        filters={filters}
        onFilterChange={onFilterChange}
        min={MIN_PRICE}
        max={MAX_PRICE}
        step={100}
        initialValues={[
          filters.minPrice ?? MIN_PRICE,
          filters.maxPrice ?? MAX_PRICE,
        ]}
        loading={loading}
        setLoading={setLoading}
        className="hidden lg:flex"
      />
      <Container>
        <Row className="gap-12 items-start ">
          {/* main content */}
          <ProductsMainContent
            filters={filters}
            onFilterChange={onFilterChange}
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={100}
            initialValues={[
              filters.minPrice ?? MIN_PRICE,
              filters.maxPrice ?? MAX_PRICE,
            ]}
            loading={loading}
            setLoading={setLoading}
            products={products}
            filter={filter}
            setFilter={setFilter}
            lastProductElementRef={lastProductElementRef}
            hasMore={hasMore}
            className="flex-1"
          />
        </Row>
      </Container>
    </section>
  );
};

export default Products;
