import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "description",
      type: "text",
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      options: { hotspot: true },
    }),
    defineField({
      name: "subcategories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "subcategory" }] }],
      title: "Subcategories",
    }),
    // defineField({
    //   name: "product",
    //   type: "array",
    //   of: [{ type: "reference", to: [{ type: "product" }] }],
    //   title: "Products",
    // }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});
