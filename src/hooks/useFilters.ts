import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

// The shape of our filter state
export interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  selectedCategories?: string[];
  selectedSizes?: string[];
  selectedColors?: string[];
  tag?: string;
  deal?: string;
  // Add other filters here, e.g., selectedSizes, selectedColors
}

export const useFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Function to parse the current URL search params into our filter state object
  const getFiltersFromUrl = useCallback((): FilterState => {
    return {
      minPrice: searchParams.has("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.has("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      selectedCategories: searchParams.getAll("category"),
      selectedSizes: searchParams.getAll("size"),
      selectedColors: searchParams.getAll("color"),
      tag: searchParams.get("tag") ?? undefined,
      deal: searchParams.get("deal") ?? undefined,
    };
  }, [searchParams]);

  const filters = getFiltersFromUrl();

  // Function to update the URL with new filter values
  const updateFilters = useCallback(
    (newFilters: Partial<FilterState>) => {
      const currentParams = new URLSearchParams(searchParams.toString());

      Object.entries(newFilters).forEach(([key, value]) => {
        if (key === "selectedCategories") {
          currentParams.delete("category");
          if (Array.isArray(value) && value.length > 0) {
            value.forEach((cat) => currentParams.append("category", cat));
          }
        } else if (key === "selectedSizes") {
          currentParams.delete("size");
          if (Array.isArray(value) && value.length > 0) {
            value.forEach((size) => currentParams.append("size", size));
          }
        } else if (key === "selectedColors") {
          currentParams.delete("color");
          if (Array.isArray(value) && value.length > 0) {
            value.forEach((color) => currentParams.append("color", color));
          }
        } else if (key === "minPrice") {
          currentParams.delete("minPrice");
          if (value !== undefined) {
            currentParams.set("minPrice", String(value));
          }
        } else if (key === "maxPrice") {
          currentParams.delete("maxPrice");
          if (value !== undefined) {
            currentParams.set("maxPrice", String(value));
          }
        } else if (key === "tag") {
          currentParams.delete("tag");
          if (value !== undefined) {
            currentParams.set("tag", String(value));
          }
        } else if (key === "deal") {
          currentParams.delete("deal");
          if (value !== undefined) {
            currentParams.set("deal", String(value));
          }
        }
      });

      router.push(`?${currentParams.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return { filters, updateFilters };
};
