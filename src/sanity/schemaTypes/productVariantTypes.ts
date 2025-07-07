import { CircleFadingPlus } from "lucide-react";
import { defineField, defineType } from "sanity";

export const productVariantType = defineType({
  name: "productVariant",
  type: "document",
  title: "Product Variant",
  icon: CircleFadingPlus,
  fields: [
    defineField({
      name: "size",
      type: "string",
      title: "Size",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Small", value: "S" },
          { title: "Medium", value: "M" },
          { title: "Large", value: "L" },
          { title: "Extra Large", value: "XL" },
          { title: "2XL", value: "2XL" },
          { title: "3XL", value: "3XL" },
        ],
      },
    }),
    defineField({
      name: "price",
      type: "number",
      title: "Price for this Size",
      description:
        "Price for this size variant (same price regardless of color)",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "compareAtPrice",
      type: "number",
      title: "Compare at Price",
      description: "Original price before discount (optional)",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "colorVariants",
      type: "array",
      title: "Color Variants",
      description: "Add available colors and their stock levels for this size",
      of: [
        {
          type: "object",
          name: "colorVariant",
          fields: [
            defineField({
              name: "color",
              type: "string",
              title: "Color",
              validation: (Rule) => Rule.required(),
              options: {
                list: [
                  { title: "Red", value: "red" },
                  { title: "Green", value: "green" },
                  { title: "Blue", value: "blue" },
                  { title: "Black", value: "black" },
                  { title: "White", value: "white" },
                  { title: "Gray", value: "gray" },
                  { title: "Navy", value: "navy" },
                  { title: "Brown", value: "brown" },
                  { title: "Pink", value: "pink" },
                  { title: "Purple", value: "purple" },
                  { title: "Orange", value: "orange" },
                  { title: "Yellow", value: "yellow" },
                  { title: "Gold", value: "gold" },
                  { title: "Silver", value: "silver" },
                ],
              },
            }),
            defineField({
              name: "colorCode",
              type: "color",
              title: "Color Code",
              description: "Pick the exact color shade",
            }),
            defineField({
              name: "stock",
              type: "number",
              title: "Available Stock",
              initialValue: 0,
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: "images",
              type: "array",
              title: "Color-specific Images",
              of: [
                {
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    {
                      name: "alt",
                      type: "string",
                      title: "Alt Text",
                      validation: (Rule) => Rule.required(),
                    },
                  ],
                },
              ],
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "sku",
      type: "string",
      title: "SKU",
      description: "Stock Keeping Unit (unique identifier for this variant)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "barcode",
      type: "string",
      title: "Barcode",
      description: "UPC, EAN, or other barcode (optional)",
    }),
    defineField({
      name: "dimensions",
      type: "object",
      title: "Dimensions",
      fields: [
        defineField({
          name: "weight",
          type: "number",
          title: "Weight (kg)",
        }),
        defineField({
          name: "length",
          type: "number",
          title: "Length (cm)",
        }),
        defineField({
          name: "width",
          type: "number",
          title: "Width (cm)",
        }),
        defineField({
          name: "height",
          type: "number",
          title: "Height (cm)",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      size: "size",
      price: "price",
      colorVariants: "colorVariants",
    },
    prepare({ size, price, colorVariants = [] }) {
      const colorCount = colorVariants?.length || 0;
      return {
        title: `Size ${size}`,
        subtitle: `$${price} - ${colorCount} color${colorCount === 1 ? "" : "s"}`,
      };
    },
  },
});
