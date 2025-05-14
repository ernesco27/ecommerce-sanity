import { Star } from "lucide-react";
import { defineField, defineType } from "sanity";

export const productReviewType = defineType({
  name: "productReview",
  type: "document",
  title: "Product Review",
  icon: Star,
  fields: [
    defineField({ name: "reviewTitle", type: "string", title: "Review Title" }),
    defineField({ name: "rating", type: "number", title: "Rating" }),
    defineField({
      name: "reviewDetails",
      type: "text",
      title: "Review Details",
    }),

    defineField({
      name: "user",
      type: "reference",
      to: [{ type: "user" }],
      title: "User",
    }),
    defineField({
      name: "product",
      type: "reference",
      to: [{ type: "product" }],
      title: "Product",
    }),
    defineField({
      name: "images",
      type: "array",
      of: [{ type: "reference", to: [{ type: "reviewImage" }] }],
      title: "Images",
    }),
  ],
});
