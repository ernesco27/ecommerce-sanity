import { defineField } from "sanity";

export const orderItemType = {
  name: "orderItem",
  title: "Order Items",
  type: "document",
  fields: [
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "productVariant",
      title: "Product Variant",
      type: "reference",
      to: [{ type: "productVariant" }],
    }),
    defineField({
      name: "quantity",
      title: "Quantity",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "price",
      title: "Price per Unit",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "appliedDiscount",
      title: "Applied Discount",
      type: "reference",
      to: [{ type: "discount" }],
    }),
  ],
};
