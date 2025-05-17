import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productAttributeType = defineType({
  name: "productAttribute",
  type: "document",
  title: "Product Attributes",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Attribute Name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "code",
      type: "string",
      title: "Attribute Code",
      description:
        "Unique identifier for the attribute (e.g., 'size', 'color')",
      validation: (Rule) => Rule.required().lowercase(),
    }),
    defineField({
      name: "displayOrder",
      type: "number",
      title: "Display Order",
      initialValue: 0,
    }),
    defineField({
      name: "values",
      type: "array",
      title: "Attribute Values",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "value",
              type: "string",
              title: "Value",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "displayName",
              type: "string",
              title: "Display Name",
            }),
            defineField({
              name: "metadata",
              type: "object",
              title: "Additional Metadata",
              fields: [
                defineField({
                  name: "hexColor",
                  type: "color",
                  title: "Color (if applicable)",
                }),
                defineField({
                  name: "image",
                  type: "image",
                  title: "Image (if applicable)",
                  options: { hotspot: true },
                }),
              ],
            }),
          ],
        },
      ],
    }),
  ],
});
