import HeadingSidebar from "@/components/custom/HeadingSidebar";
import { cn } from "@/lib/utils";
import React from "react";
import { Separator } from "@/components/ui/separator";
import PriceSlider from "@/components/custom/PriceSlider";
import ProductsCatAccordion from "@/components/custom/ProductsCatAccordion";
import SizeFilter from "@/components/custom/SizeFilter";
import ColorFilter from "@/components/custom/ColorFilter";

interface FilterState {
  minPrice: number;
  maxPrice: number;
  selectedSizes: string[];
  selectedColors: string[];
  selectedCategories: string[];
}

interface ProductsSidebarLeftProps {
  filters: FilterState;
  onFilterChange: (filterType: keyof FilterState, value: any) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  className?: string;
}

const ProductsSidebarLeft = ({
  filters,
  onFilterChange,
  loading,
  setLoading,
  className,
}: ProductsSidebarLeftProps) => {
  const handlePriceChange = (values: [number, number]) => {
    onFilterChange("minPrice", values[0]);
    onFilterChange("maxPrice", values[1]);
  };

  return (
    <div className={cn("lg:max-w-[300px] h-full", className)}>
      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col gap-4 items-center w-full">
          <HeadingSidebar name="Product Categories" />
          <ProductsCatAccordion
            selectedCategories={filters.selectedCategories}
            onCategoryChange={(categories) =>
              onFilterChange("selectedCategories", categories)
            }
          />
          <HeadingSidebar name="Price" />
          <PriceSlider
            initialMin={filters.minPrice}
            initialMax={filters.maxPrice}
            onChange={handlePriceChange}
          />
          <Separator />
          <HeadingSidebar name="Size" />
          <SizeFilter
            selectedSizes={filters.selectedSizes}
            onSizeChange={(sizes) => onFilterChange("selectedSizes", sizes)}
          />
          <Separator />
          <HeadingSidebar name="Color" />
          <ColorFilter
            selectedColors={filters.selectedColors}
            onColorChange={(colors) => onFilterChange("selectedColors", colors)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsSidebarLeft;
