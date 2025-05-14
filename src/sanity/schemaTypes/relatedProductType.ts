import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const relatedProduct = defineType({
  name: "relatedProduct",
  type: "document",
  title: "Related Product",
  icon: TrolleyIcon,
  fields: [
    defineField({ name: "link", type: "url", title: "Link" }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: { source: "link" },
    }),
    defineField({
      name: "product",
      type: "reference",
      to: [{ type: "product" }],
      title: "Product",
    }),
  ],
});
