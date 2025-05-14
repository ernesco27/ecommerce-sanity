import { defineField, defineType } from "sanity";

export const productWishlistType = defineType({
  name: "productWishlist",
  type: "document",
  title: "Product Wishlist",
  fields: [
    defineField({
      name: "product",
      type: "reference",
      to: [{ type: "product" }],
      title: "Product",
    }),
    defineField({
      name: "user",
      type: "reference",
      to: [{ type: "user" }],
      title: "User",
    }),
  ],
});
