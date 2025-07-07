import React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductsContent from "@/components/modules/products/ProductsContent";
import type { ProductsQueryResult } from "../../../../sanity.types";
import { Loader2 } from "lucide-react";
import MobileFilters from "@/components/custom/MobileFilters";
import type { FilterState } from "@/hooks/useFilters";

interface ProductsMainContentProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  min: number;
  max: number;
  step: number;
  initialValues: [number, number];
  loading: boolean;
  setLoading: (v: boolean) => void;
  className?: string;
  filter: string;
  setFilter: (v: string) => void;
  products: ProductsQueryResult[0][];
  lastProductElementRef: (node: HTMLElement | null) => void;
  hasMore: boolean;
}

const ProductsMainContent = ({
  filters,

  onFilterChange,
  min,
  max,
  initialValues,
  step,
  loading,
  setLoading,
  products,
  filter,
  setFilter,
  lastProductElementRef,
  hasMore,
  className,
}: ProductsMainContentProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-6 mt-14">
        <MobileFilters
          filters={filters}
          onFilterChange={onFilterChange}
          min={min}
          max={max}
          initialValues={initialValues}
          step={step}
          loading={loading}
          setLoading={setLoading}
        />
        <div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px] cursor-pointer background-light900_dark200 ">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="mr-2 background-light900_dark200">
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="price_low_to_high">
                Price: Low to High
              </SelectItem>
              <SelectItem value="price_high_to_low">
                Price: High to Low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="text-sm text-gray-500">Showing {products.length} results</p>
      <div className="relative">
        <ProductsContent
          products={products}
          lastProductElementRef={lastProductElementRef}
        />
        {loading && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center py-4 background-light800_dark100">
            <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
          </div>
        )}
        {!loading && !hasMore && products.length > 0 && (
          <p className="text-center text-gray-500 py-4 ">
            No more products to load
          </p>
        )}
        {!loading && products.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No products found matching your filters
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductsMainContent;
