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
interface FilterState {
  minPrice: number;
  maxPrice: number;
  selectedSizes: string[];
  selectedColors: string[];
  selectedCategories: string[];
}

interface ProductsMainContentProps {
  filters: FilterState;
  onFilterChange: (filterType: keyof FilterState, value: any) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  products: ProductsQueryResult[0][];
  filter: string;
  setFilter: (v: string) => void;
  lastProductElementRef: (node: HTMLElement | null) => void;
  hasMore: boolean;
  className?: string;
}

const ProductsMainContent = ({
  filters,
  onFilterChange,
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
      <div className="flex justify-between items-center mb-6">
        <MobileFilters
          filters={filters}
          onFilterChange={onFilterChange}
          loading={loading}
          setLoading={setLoading}
        />
        <div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px] cursor-pointer ">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="mr-2">
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
          <div className="absolute bottom-0 left-0 right-0 flex justify-center py-4 bg-white/80">
            <Loader2 className="h-6 w-6 animate-spin text-yellow-600" />
          </div>
        )}
        {!loading && !hasMore && products.length > 0 && (
          <p className="text-center text-gray-500 py-4">
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
