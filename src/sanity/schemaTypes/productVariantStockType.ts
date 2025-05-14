import { defineField, defineType } from "sanity";

export const ProductVariantStockType = defineType({
  name: "variantStock",
  type: "object",
  title: "Variant Stock (Color and Quantity)",
  fields: [
    defineField({
      name: "color",
      type: "string",
      title: "Color",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hexCode",
      type: "color",
      title: "Hex Code",
      description: "Hex color code for display",
    }),
    defineField({
      name: "stock",
      type: "number",
      title: "Stock",
      validation: (Rule) => Rule.min(0).required(),
    }),
    defineField({
      name: "images",
      type: "array",
      title: "Variant Images",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
  ],
});
