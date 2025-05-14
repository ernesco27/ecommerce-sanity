import { ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productImageType = defineType({
  name: "productImage",
  type: "document",
  title: "Product Image",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "images",
      type: "array",
      title: "Images",
      of: [
        {
          type: "image",
          options: {
            hotspot: true, // Enables image cropping and focal point selection
          },
        },
      ],
      description: "Upload one or more images for this product.",
    }),
    defineField({
      name: "altText",
      type: "array",
      title: "Alt Texts",
      of: [{ type: "string" }],
      description:
        "Alternative text for each image. This should match the order of the uploaded images.",
    }),
    defineField({
      name: "product",
      type: "reference",
      to: [{ type: "product" }],
      title: "Linked Product",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
