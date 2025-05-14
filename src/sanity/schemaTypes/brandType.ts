import { Landmark } from "lucide-react";
import { defineField, defineType } from "sanity";

export const brandType = defineType({
  name: "brand",
  type: "document",
  title: "Brand",
  icon: Landmark,
  fields: [
    defineField({ name: "name", type: "string", title: "Name" }),
    defineField({ name: "link", type: "url", title: "Link" }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: { source: "name" },
    }),

    defineField({ name: "description", type: "text", title: "Description" }),
    // defineField({
    //   name: "products",
    //   type: "array",
    //   of: [{ type: "reference", to: [{ type: "product" }] }],
    //   title: "Products",
    // }),
  ],
});
