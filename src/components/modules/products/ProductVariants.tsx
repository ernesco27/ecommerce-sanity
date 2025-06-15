import React, { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Product, ProductVariant, Color } from "../../../../sanity.types";

type ColorName =
  | "red"
  | "green"
  | "blue"
  | "black"
  | "white"
  | "gray"
  | "navy"
  | "brown";

interface ColorVariant {
  color?: ColorName;
  colorCode?: Color;
  stock?: number;
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
    };
    media?: unknown;
    hotspot?: unknown;
    crop?: unknown;
    alt?: string;
    _type: "image";
    _key: string;
  }>;
  _type: "colorVariant";
  _key: string;
}

const ProductVariants = ({
  product,
  selectedVariants,
  setSelectedVariants,
}: {
  product: Product;
  selectedVariants: Record<string, string>;
  setSelectedVariants: (
    value:
      | Record<string, string>
      | ((prev: Record<string, string>) => Record<string, string>),
  ) => void;
}) => {
  const handleVariantChange = (variantName: string, value: string) => {
    setSelectedVariants((prev: Record<string, string>) => ({
      ...prev,
      [variantName]: value,
    }));
  };

  // Get available options based on current selection
  const availableOptions = useMemo(() => {
    const options: Record<string, Set<string>> = {};

    product.variants?.forEach((variantRef) => {
      if (!variantRef) return;

      // For size variants
      const variant = variantRef as unknown as ProductVariant;
      if (variant.size) {
        const sizeKey = "Size";
        if (!options[sizeKey]) {
          options[sizeKey] = new Set();
        }

        // Check if any color variant has stock for this size
        const hasStock = variant.colorVariants?.some(
          (colorVariant: ColorVariant) =>
            colorVariant.stock && colorVariant.stock > 0,
        );

        if (hasStock) {
          options[sizeKey].add(variant.size);
        }
      }

      // For color variants
      variant.colorVariants?.forEach((colorVariant: ColorVariant) => {
        const colorKey = "Color";
        if (!options[colorKey]) {
          options[colorKey] = new Set();
        }

        if (
          colorVariant.stock &&
          colorVariant.stock > 0 &&
          colorVariant.color
        ) {
          options[colorKey].add(colorVariant.color);
        }
      });
    });

    return options;
  }, [product.variants]);

  return (
    <div className="space-y-2.5 flex flex-col gap-8 mb-10">
      {/* Size Variant */}
      {product.variants?.some(
        (v) => (v as unknown as ProductVariant)?.size,
      ) && (
        <fieldset className="space-y-1.5">
          <legend className="mb-4">
            <Label asChild>
              <span>
                Size:
                {selectedVariants["Size"] && (
                  <span className="ml-2 font-normal text-lg">
                    {selectedVariants["Size"]}
                  </span>
                )}
              </span>
            </Label>
          </legend>
          <div className="flex flex-wrap gap-6">
            {product.variants?.map((variantRef) => {
              const variant = variantRef as unknown as ProductVariant;
              if (!variant?.size) return null;

              const isSelected = selectedVariants["Size"] === variant.size;
              const isAvailable = availableOptions["Size"]?.has(variant.size);

              return (
                <div key={variant._id} className="flex items-center relative">
                  <input
                    type="radio"
                    id={`size-${variant._id}`}
                    name="Size"
                    value={variant.size}
                    checked={isSelected}
                    onChange={() =>
                      variant.size && handleVariantChange("Size", variant.size)
                    }
                    disabled={!isAvailable}
                    className="peer hidden"
                  />
                  <Label
                    htmlFor={`size-${variant._id}`}
                    className={cn(
                      "flex items-center justify-center min-w-14 gap-1.5 border p-2",
                      !isAvailable
                        ? "cursor-not-allowed text-slate-400 bg-slate-100 line-through"
                        : "cursor-pointer",
                      isSelected && !isAvailable
                        ? "bg-slate-300 text-slate-500 border-slate-400 line-through"
                        : "",
                      isSelected && isAvailable
                        ? "primary-gradient text-white border-primary-500"
                        : "",
                    )}
                  >
                    {variant.size}
                  </Label>
                </div>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Color Variant */}
      {product.variants?.some(
        (v) => (v as unknown as ProductVariant)?.colorVariants?.length,
      ) && (
        <fieldset className="space-y-1.5">
          <legend className="mb-4">
            <Label asChild>
              <span className="">
                Color:
                {selectedVariants["Color"] && (
                  <span className="ml-2 font-normal text-lg capitalize">
                    {selectedVariants["Color"]}
                  </span>
                )}
              </span>
            </Label>
          </legend>
          <div className="flex flex-wrap gap-6">
            {/* Collect unique colors */}
            {(() => {
              const colorMap = new Map<string, ColorVariant>();
              product.variants?.forEach((variantRef) => {
                const variant = variantRef as unknown as ProductVariant;
                variant.colorVariants?.forEach((colorVariant: ColorVariant) => {
                  if (colorVariant.color && !colorMap.has(colorVariant.color)) {
                    colorMap.set(colorVariant.color, colorVariant);
                  }
                });
              });
              return Array.from(colorMap.values()).map((colorVariant) => {
                const color = colorVariant.color;
                if (!color) return null;
                const isSelected = selectedVariants["Color"] === color;
                const isAvailable = availableOptions["Color"]?.has(color);
                return (
                  <div key={color} className="flex items-center relative">
                    <input
                      type="radio"
                      id={`color-${color}`}
                      name="Color"
                      value={color}
                      checked={isSelected}
                      onChange={() =>
                        color && handleVariantChange("Color", color)
                      }
                      disabled={!isAvailable}
                      className="peer hidden"
                    />
                    <Label
                      htmlFor={`color-${color}`}
                      className={cn(
                        "relative w-8 h-8 rounded-full flex items-center justify-center",
                        !isAvailable
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer",
                        isSelected && "ring-2 ring-offset-2",
                      )}
                      style={{
                        backgroundColor: colorVariant.colorCode?.hex,
                        ...(isSelected && colorVariant.colorCode?.hex
                          ? {
                              "--ring-color": colorVariant.colorCode.hex,
                              borderColor: colorVariant.colorCode.hex,
                              boxShadow: `0 0 0 2px white, 0 0 0 4px var(--ring-color)`,
                            }
                          : {}),
                      }}
                    >
                      <span className="sr-only">{color}</span>
                      {!isAvailable && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                          X
                        </span>
                      )}
                    </Label>
                  </div>
                );
              });
            })()}
          </div>
        </fieldset>
      )}
    </div>
  );
};

export default ProductVariants;
