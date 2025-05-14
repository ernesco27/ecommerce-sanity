import { defineField, defineType } from "sanity";

export const productVariantValueType = defineType({
  name: "productVariantValue",
  type: "document",
  title: "Product Variant Value",
  fields: [
    defineField({
      name: "type",
      type: "string",
      title: "Value Type",
      options: {
        list: [
          { title: "Size", value: "size" },
          { title: "Color", value: "color" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    // Size Fields
    defineField({
      name: "size",
      type: "string",
      title: "Size",
      hidden: ({ parent }) => parent?.type !== "size", // Shows only if 'size' is selected
    }),
    // Color Fields
    defineField({
      name: "colorName",
      type: "string",
      title: "Color Name",
      hidden: ({ parent }) => parent?.type !== "color", // Shows only if 'color' is selected
    }),
    defineField({
      name: "hexCode",
      type: "string",
      title: "Hex Code",
      description: "Color hex code",
      hidden: ({ parent }) => parent?.type !== "color", // Shows only if 'color' is selected
    }),
    // defineField({
    //   name: "product",
    //   type: "reference",
    //   to: [{ type: "product" }],
    //   title: "Linked Product",
    // }),
  ],
  preview: {
    select: {
      type: "type",
      size: "size",
      color: "colorName",
      hexCode: "hexCode",
    },
    prepare(selection) {
      const { type, size, color, hexCode } = selection;

      if (type === "size") {
        return {
          title: `Size: ${size || "N/A"}`,
        };
      } else if (type === "color") {
        return {
          title: `Color: ${color || "N/A"}`,
          subtitle: `Hex Code: ${hexCode || "N/A"}`,
        };
      }
      return { title: "Unknown Type" };
    },
  },
});
