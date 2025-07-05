import HeadingSidebar from "@/components/custom/HeadingSidebar";
import { cn } from "@/lib/utils";
import React from "react";
import { Separator } from "@/components/ui/separator";
import PriceSlider from "@/components/custom/PriceSlider";
import ProductsCatAccordion from "@/components/custom/ProductsCatAccordion";
import SizeFilter from "@/components/custom/SizeFilter";
import ColorFilter from "@/components/custom/ColorFilter";

// Use the shared FilterState interface from useFilters
import type { FilterState } from "@/hooks/useFilters";

interface ProductsSidebarLeftProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  min: number;
  max: number;
  step: number;
  initialValues: [number, number];
  loading: boolean;
  setLoading: (v: boolean) => void;
  className?: string;
}

const ProductsSidebarLeft = ({
  filters,
  onFilterChange,
  min,
  max,
  initialValues,
  step,
  loading,
  setLoading,
  className,
}: ProductsSidebarLeftProps) => {
  return (
    <div
      className={cn(
        "h-screen w-fit  lg:w-[350px] flex-col  background-light900_dark200 border-r-2 light-border sticky left-0 top-0 p-6 pt-20 overflow-y-auto shadow-light-300 dark:shadow-none max-sm:hidden custom-scrollbar ",
        className,
      )}
    >
      <div className="flex flex-col gap-8 items-center">
        <div className="flex flex-col gap-4 items-center w-full">
          <HeadingSidebar name="Product Categories" />
          <ProductsCatAccordion
            selectedCategories={filters.selectedCategories ?? []}
            onCategoryChange={(categories) =>
              onFilterChange({ selectedCategories: categories })
            }
          />
          <HeadingSidebar name="Price" />
          <PriceSlider
            min={min}
            max={max}
            step={step}
            initialValues={initialValues}
            onCommit={(values) =>
              onFilterChange({ minPrice: values[0], maxPrice: values[1] })
            }
          />
          <Separator />
          <HeadingSidebar name="Size" />
          <SizeFilter
            selectedSizes={filters.selectedSizes ?? []}
            onSizeChange={(sizes) => onFilterChange({ selectedSizes: sizes })}
            className="flex flex-col gap-2"
          />
          <Separator />
          <HeadingSidebar name="Color" />
          <ColorFilter
            selectedColors={filters.selectedColors ?? []}
            onColorChange={(colors) =>
              onFilterChange({ selectedColors: colors })
            }
            className="flex flex-col ml-10"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsSidebarLeft;
