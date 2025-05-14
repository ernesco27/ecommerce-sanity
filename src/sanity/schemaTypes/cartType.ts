import { ShoppingCart } from "lucide-react";
import { defineField } from "sanity";

export const cartType = {
  name: "cart",
  title: "Shopping Carts",
  type: "document",
  icon: ShoppingCart,
  fields: [
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      title: "Cart Items",
      type: "array",
      of: [
        {
          type: "object",
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
          ],
        },
      ],
    }),
    defineField({
      name: "subtotal",
      title: "Subtotal",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "appliedDiscounts",
      title: "Applied Discounts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "discount" }] }],
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Cart Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Abandoned", value: "abandoned" },
          { title: "Converted", value: "converted" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
};
