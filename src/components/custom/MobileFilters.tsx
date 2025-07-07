"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import ProductsCatAccordion from "./ProductsCatAccordion";
import PriceSlider from "./PriceSlider";
import SizeFilter from "./SizeFilter";
import ColorFilter from "./ColorFilter";
import { Separator } from "@/components/ui/separator";
import HeadingSidebar from "./HeadingSidebar";
import { FilterState } from "@/hooks/useFilters";

interface MobileFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  className?: string;
  min: number;
  max: number;
  step: number;
  initialValues: [number, number];
}

const MobileFilters = ({
  filters,
  onFilterChange,
  loading,
  setLoading,
  className,
  min,
  max,
  initialValues,
  step,
}: MobileFiltersProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            className="background-light900_dark200 text-dark400_light900 cursor-pointer"
          >
            <Filter /> Filters
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="max-h-[90vh] overflow-y-auto p-4 w-full background-light900_dark200"
        >
          <SheetHeader>
            <SheetTitle className="text-xl font-bold">Filters</SheetTitle>
          </SheetHeader>
          <HeadingSidebar name="Product Categories" />
          <ProductsCatAccordion
            selectedCategories={filters.selectedCategories ?? []}
            onCategoryChange={(categories) =>
              onFilterChange({ selectedCategories: categories })
            }
          />
          <Separator />
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
            className="flex flex-wrap gap-2"
          />
          <Separator />
          <HeadingSidebar name="Color" />
          <ColorFilter
            selectedColors={filters.selectedColors ?? []}
            onColorChange={(colors) =>
              onFilterChange({ selectedColors: colors })
            }
            className="flex flex-wrap"
          />
          <Button
            variant="outline"
            className="w-full mt-4 bg-primary-500 hover:bg-primary-100 transition-all duration-300 ease-in-out"
            onClick={() => {
              setOpen(false);
            }}
          >
            Apply Filters
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileFilters;
