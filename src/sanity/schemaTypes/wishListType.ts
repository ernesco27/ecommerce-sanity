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
    defineField({
      name: "notes",
      type: "text",
      title: "Notes",
      description: "Personal notes about the wishlisted product",
    }),
    defineField({
      name: "variant",
      type: "reference",
      to: [{ type: "productVariant" }],
      title: "Preferred Variant",
      description: "Specific variant of the product if any",
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
      media: "product.images[0]",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || "Untitled Product",
        subtitle: subtitle || "No user specified",
        media: media,
      };
    },
  },
});
