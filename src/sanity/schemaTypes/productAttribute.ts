import { defineField, defineType } from "sanity";

export const productAttribute = defineType({
  name: "productAttribute",
  type: "document",
  title: "Product Attribute",
  fields: [
    defineField({ name: "name", type: "string", title: "Attribute Name" }),
    defineField({ name: "description", type: "text", title: "Description" }),
    defineField({
      name: "values",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productAttributeValue" }] }],
      title: "Attribute Values",
    }),
  ],
});
