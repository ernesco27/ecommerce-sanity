import { Star } from "lucide-react";
import { defineField, defineType } from "sanity";

export const productReviewType = defineType({
  name: "productReview",
  type: "document",
  title: "Product Review",
  icon: Star,
  fields: [
    defineField({
      name: "reviewTitle",
      type: "string",
      title: "Review Title",
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: "rating",
      type: "number",
      title: "Rating",
      validation: (Rule) => Rule.required().min(1).max(5),
      description: "Rating from 1 to 5 stars",
    }),
    defineField({
      name: "reviewDetails",
      type: "text",
      title: "Review Details",
      validation: (Rule) => Rule.required().min(10),
      description: "Detailed review content",
    }),
    defineField({
      name: "user",
      type: "reference",
      to: [{ type: "user" }],
      title: "User",
      validation: (Rule) => Rule,
    }),
    defineField({
      name: "product",
      type: "reference",
      to: [{ type: "product" }],
      title: "Product",
      validation: (Rule) => Rule,
    }),
    defineField({
      name: "productVariant",
      type: "reference",
      to: [{ type: "productVariant" }],
      title: "Product Variant",
      description: "Specific variant being reviewed (if applicable)",
    }),
    defineField({
      name: "verifiedPurchase",
      type: "boolean",
      title: "Verified Purchase",
      description: "Indicates if the review is from a verified purchase",
      initialValue: false,
    }),
    defineField({
      name: "images",
      type: "array",
      of: [{ type: "reference", to: [{ type: "reviewImage" }] }],
      title: "Review Images",
      description: "Images uploaded with the review",
      validation: (Rule) => Rule.max(10),
    }),
    defineField({
      name: "helpfulVotes",
      type: "number",
      title: "Helpful Votes",
      description: "Number of users who found this review helpful",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "status",
      type: "string",
      title: "Review Status",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "reviewDate",
      type: "datetime",
      title: "Review Date",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "lastModified",
      type: "datetime",
      title: "Last Modified",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "reviewTitle",
      subtitle: "user.email",
      rating: "rating",
      status: "status",
    },
    prepare(selection) {
      const { title, subtitle, rating, status } = selection;
      return {
        title: title || "Untitled Review",
        subtitle: `${subtitle || "Anonymous"} - ${rating}⭐ (${status})`,
      };
    },
  },
});
