import { defineField, defineType } from "sanity";
import { HeartIcon } from "@sanity/icons";

export const productWishlistType = defineType({
  name: "productWishlist",
  type: "document",
  title: "Product Wishlist",
  icon: HeartIcon,
  fields: [
    defineField({
      name: "product",
      type: "reference",
      to: [{ type: "product" }],
      title: "Product",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "user",
      type: "reference",
      to: [{ type: "user" }],
      title: "User",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "addedAt",
      type: "datetime",
      title: "Added At",
      description: "Date and time when the product was added to wishlist",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    // defineField({
    //   name: "notes",
    //   type: "text",
    //   title: "Notes",
    //   description: "Personal notes about the wishlisted product",
    // }),
    // defineField({
    //   name: "variant",
    //   type: "reference",
    //   to: [{ type: "productVariant" }],
    //   title: "Preferred Variant",
    //   description: "Specific variant of the product if any",
    // }),
    defineField({
      name: "variant",
      type: "object",
      title: "Preferred Variant",
      fields: [
        { name: "variantId", type: "string", title: "Variant ID" },
        { name: "color", type: "string", title: "Color" },
        { name: "size", type: "string", title: "Size" },
        { name: "price", type: "number", title: "Price" },
      ],
    }),
    defineField({
      name: "quantity",
      type: "number",
      title: "Quantity",
      description: "Quantity of item added to the wishlist",
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .integer()
          .error("Quantity must be a positive integer."),
      initialValue: 1, // Default to 1 if not specified
    }),
    defineField({
      name: "notifyWhenAvailable",
      type: "boolean",
      title: "Notify When Available",
      description: "Send notification when product is back in stock",
      initialValue: false,
    }),
    defineField({
      name: "notifyOnPriceChange",
      type: "boolean",
      title: "Notify on Price Change",
      description: "Send notification when product price changes",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "product.name",
      subtitle: "user.email",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || "Untitled Product",
        subtitle: subtitle || "No user specified",
      };
    },
  },
});
