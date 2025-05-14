import { CircleFadingPlus } from "lucide-react";
import { defineField, defineType } from "sanity";

export const productVariantType = defineType({
  name: "productVariant",
  type: "document",
  title: "Product Variant (Size)",
  icon: CircleFadingPlus,
  fields: [
    // defineField({
    //   name: "variantName",
    //   type: "string",
    //   title: "Variant Name",
    //   validation: (Rule) => Rule.required(),
    // }),
    defineField({
      name: "size",
      type: "string",
      title: "Size",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      type: "number",
      title: "Price",
      validation: (Rule) => Rule.min(0).required(),
    }),
    defineField({
      name: "salesPrice",
      type: "number",
      title: "Sales Price",
    }),
    defineField({
      name: "variantStocks",
      type: "array",
      title: "Variant Stocks",
      of: [{ type: "variantStock" }],
    }),

    // defineField({
    //   name: "stock",
    //   type: "number",
    //   title: "Stock",
    //   validation: (Rule) => Rule.min(0).required(),
    // }),

    // defineField({
    //   name: "variantValues",
    //   type: "array",
    //   title: "Variant Values",
    //   of: [{ type: "productVariantValue" }],
    // }),

    // defineField({
    //   name: "product",
    //   type: "reference",
    //   to: [{ type: "product" }],
    //   title: "Linked Product",
    // }),
  ],
});
