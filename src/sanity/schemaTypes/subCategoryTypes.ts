import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const subcategoryType = defineType({
  name: "subcategory",
  type: "document",
  title: "Subcategory",
  icon: TagIcon,
  fields: [
    defineField({ name: "name", type: "string", title: "Name" }),

    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: { source: "name" },
    }),
    // defineField({
    //   name: "category",
    //   type: "reference",
    //   to: [{ type: "category" }],
    //   title: "Category",
    // }),
    // defineField({
    //   name: "products",
    //   type: "array",
    //   of: [{ type: "reference", to: [{ type: "product" }] }],
    //   title: "Products",
    // }),
  ],
});
