import { UserIcon } from "@sanity/icons";
import { defineType, defineField } from "sanity";

export const userType = defineType({
  name: "user",
  type: "document",
  title: "User",
  icon: UserIcon,
  fields: [
    defineField({ name: "firstName", type: "string", title: "First Name" }),
    defineField({ name: "lastName", type: "string", title: "Last Name" }),
    defineField({ name: "email", type: "string", title: "Email" }),
    defineField({
      name: "photo",
      type: "image",
      title: "Photo",
      options: { hotspot: true },
    }),
    defineField({
      name: "productReviews",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productReview" }] }],
      title: "Product Reviews",
    }),
    defineField({
      name: "wishlist",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productWishlist" }] }],
      title: "Wishlist",
    }),
    // defineField({
    //   name: "productLikes",
    //   type: "array",
    //   of: [{ type: "reference", to: [{ type: "productLike" }] }],
    //   title: "Product Likes",
    // }),
  ],
});
