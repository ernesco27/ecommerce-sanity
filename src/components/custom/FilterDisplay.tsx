import { formatPriceRange } from "@/lib/utils";
import ActiveFilter from "./ActiveFilter";
import { FilterState } from "@/hooks/useFilters";

interface DisplayProps {
  filters: FilterState;
  onClearAll: () => void;
  onRemoveFilter: (type: string, value: string | number) => void;
}

const FilterDisplay = ({
  filters,
  onClearAll,
  onRemoveFilter,
}: DisplayProps) => {
  const hasActiveFilters =
    filters.deal ||
    filters.maxPrice ||
    filters.minPrice ||
    (filters.selectedCategories?.length ?? 0) > 0 ||
    (filters.selectedColors?.length ?? 0) > 0 ||
    (filters.selectedSizes?.length ?? 0) > 0 ||
    filters.tag;

  const isPriceRangeActive =
    filters.minPrice !== undefined || filters.maxPrice !== undefined;

  if (!hasActiveFilters) {
    return null; // Don't render anything if no filters are active
  }

  return (
    <div className="flex flex-wrap items-center gap-4 m-4">
      <p>Active Filter(s)</p>

      {/* Render selected categories */}
      {filters.selectedCategories &&
        filters.selectedCategories.map((category) => (
          <ActiveFilter
            key={`category-${category}`}
            type="category"
            value={category}
            onRemove={onRemoveFilter}
          />
        ))}

      {/* Render selected colors */}
      {filters.selectedColors &&
        filters.selectedColors.map((color) => (
          <ActiveFilter
            key={`color-${color}`}
            type="color"
            value={color}
            onRemove={onRemoveFilter}
          />
        ))}

      {/* Render selected sizes */}
      {filters.selectedSizes &&
        filters.selectedSizes.map((size) => (
          <ActiveFilter
            key={`size-${size}`}
            type="size"
            value={size}
            onRemove={onRemoveFilter}
          />
        ))}

      {/* Render tag */}
      {filters.tag && (
        <ActiveFilter
          key="tag"
          type="tag"
          value={filters.tag}
          onRemove={onRemoveFilter}
        />
      )}
      {filters.deal && (
        <ActiveFilter
          key="deal"
          type="deal"
          value="Deals"
          onRemove={onRemoveFilter}
        />
      )}
      {isPriceRangeActive && (
        <ActiveFilter
          key="price-range"
          type="priceRange" // A new, unique type for the price range
          value={formatPriceRange(filters.minPrice, filters.maxPrice)}
          onRemove={onRemoveFilter}
        />
      )}

      <p
        className="text-primary-900 hover:text-red-500 transition-all duration-200 ease-in-out hover:underline hover:font-medium cursor-pointer dark:text-primary-500 dark:hover:text-red-500"
        onClick={onClearAll}
      >
        x Clear All
      </p>
    </div>
  );
};

export default FilterDisplay;
