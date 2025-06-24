"use client";

import Container from "@/components/custom/Container";
import Row from "@/components/custom/Row";
import React from "react";
import ProductsSidebarLeft from "@/components/modules/products/ProductsSidebarLeft";
import ProductsMainContent from "@/components/modules/products/ProductsMainContent";
import type { ProductsQueryResult } from "../../../../sanity.types";

interface FilterState {
  minPrice: number;
  maxPrice: number;
  selectedSizes: string[];
  selectedColors: string[];
  selectedCategories: string[];
}

interface ProductsProps {
  filters: FilterState;
  onFilterChange: (filterType: keyof FilterState, value: any) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  filter: string;
  setFilter: (v: string) => void;
  products: ProductsQueryResult[0][];
  lastProductElementRef: (node: HTMLElement | null) => void;
  hasMore: boolean;
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
}: ProductsProps & { className?: string }) => {
  return (
    <section className="my-10 ">
      <Container>
        <Row className="gap-12 items-start ">
          {/* sidebar */}
          <ProductsSidebarLeft
            filters={filters}
            onFilterChange={onFilterChange}
            loading={loading}
            setLoading={setLoading}
            className="hidden lg:flex"
          />

          {/* main content */}
          <ProductsMainContent
            filters={filters}
            onFilterChange={onFilterChange}
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
