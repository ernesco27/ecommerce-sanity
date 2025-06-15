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

interface FilterState {
  minPrice: number;
  maxPrice: number;
  selectedSizes: string[];
  selectedColors: string[];
  selectedCategories: string[];
}

interface MobileFiltersProps {
  filters: FilterState;
  onFilterChange: (filterType: keyof FilterState, value: any) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  className?: string;
}

const MobileFilters = ({
  filters,
  onFilterChange,
  loading,
  setLoading,
  className,
}: MobileFiltersProps) => {
  const [open, setOpen] = useState(false);
  const handlePriceChange = (values: [number, number]) => {
    onFilterChange("minPrice", values[0]);
    onFilterChange("maxPrice", values[1]);
  };

  return (
    <div className="w-full">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline">
            <Filter /> Filters
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="max-h-[90vh] overflow-y-auto p-4 w-full  "
        >
          <SheetHeader>
            <SheetTitle className="text-xl font-bold">Filters</SheetTitle>
          </SheetHeader>
          <HeadingSidebar name="Product Categories" />
          <ProductsCatAccordion
            selectedCategories={filters.selectedCategories}
            onCategoryChange={(categories) =>
              onFilterChange("selectedCategories", categories)
            }
          />
          <Separator />
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
            className="flex flex-wrap gap-2"
          />
          <Separator />
          <HeadingSidebar name="Color" />
          <ColorFilter
            selectedColors={filters.selectedColors}
            onColorChange={(colors) => onFilterChange("selectedColors", colors)}
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
