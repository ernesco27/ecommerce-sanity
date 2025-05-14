import { TrolleyIcon } from "@sanity/icons";
import { defineField, validation } from "sanity";

export const productType = {
  name: "product",
  title: "Products",
  type: "document",

  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Product Description",
      type: "text",

      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "fullDescription",
      type: "blockContent",
      title: "Full Description",
    }),
    defineField({
      name: "baseStock",
      type: "number",
      title: "Base Stock",
      description: "Total stock of all variants",
      readOnly: true,
    }),
    defineField({ name: "price", type: "number", title: "Price" }),
    defineField({ name: "salesPrice", type: "number", title: "Sales Price" }),
    defineField({ name: "sku", type: "string", title: "SKU" }),
    defineField({
      name: "variants",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productVariant" }] }],
      title: "Product Variants",
    }),

    defineField({
      name: "images",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productImage" }] }],
      title: "All Images",
    }),

    defineField({
      name: "isAvailable",
      type: "boolean",
      title: "Is Available",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      type: "boolean",
      title: "Featured",
      initialValue: false,
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      title: "Category",
    }),
    defineField({
      name: "brand",
      type: "reference",
      to: [{ type: "brand" }],
      title: "Brand",
    }),
    defineField({
      name: "discount",
      type: "reference",
      to: [{ type: "discount" }],
      title: "Discount",
    }),
    defineField({
      name: "reviews",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productReview" }] }],
      title: "Reviews",
    }),
    defineField({
      name: "relatedProducts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "relatedProduct" }] }],
      title: "Related Products",
    }),
  ],
};
