import { cn } from "@/lib/utils";
import React from "react";

const SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"];

interface SizeFilterProps {
  selectedSizes: string[];
  onSizeChange: (sizes: string[]) => void;
  className?: string;
}

const SizeFilter: React.FC<SizeFilterProps> = ({
  selectedSizes,
  onSizeChange,
  className,
}) => {
  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      onSizeChange(selectedSizes.filter((s) => s !== size));
    } else {
      onSizeChange([...selectedSizes, size]);
    }
  };

  return (
    <div className={cn("w-full ", className)}>
      {SIZES.map((size) => (
        <button
          key={size}
          onClick={() => toggleSize(size)}
          className={`
            w-[45px] h-[45px] rounded-md
            border border-gray-200
            flex items-center justify-center
            transition-all duration-200
            hover:border-yellow-700 cursor-pointer
            ${
              selectedSizes.includes(size)
                ? "bg-yellow-400 text-white border-yellow-400"
                : "bg-white text-gray-700"
            }
          `}
        >
          {size}
        </button>
      ))}
    </div>
  );
};

export default SizeFilter;
