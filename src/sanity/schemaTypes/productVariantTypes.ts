import { CircleFadingPlus } from "lucide-react";
import { defineField, defineType } from "sanity";

export const productVariantType = defineType({
  name: "productVariant",
  type: "document",
  title: "Product Variant",
  icon: CircleFadingPlus,
  fields: [
    defineField({
      name: "sku",
      type: "string",
      title: "SKU",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "attributes",
      type: "array",
      title: "Variant Attributes",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "attribute",
              type: "reference",
              to: [{ type: "productAttribute" }],
              title: "Attribute",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "value",
              type: "string",
              title: "Value",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "pricing",
      type: "object",
      title: "Pricing",
      fields: [
        defineField({
          name: "basePrice",
          type: "number",
          title: "Base Price",
          validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
          name: "salePrice",
          type: "number",
          title: "Sale Price",
          validation: (Rule) => Rule.min(0),
        }),
        defineField({
          name: "validFrom",
          type: "datetime",
          title: "Price Valid From",
        }),
        defineField({
          name: "validTo",
          type: "datetime",
          title: "Price Valid To",
        }),
      ],
    }),
    defineField({
      name: "inventory",
      type: "object",
      title: "Inventory",
      fields: [
        defineField({
          name: "quantity",
          type: "number",
          title: "Available Quantity",
          validation: (Rule) => Rule.required().min(0),
          initialValue: 0,
        }),
        defineField({
          name: "lowStockThreshold",
          type: "number",
          title: "Low Stock Threshold",
          validation: (Rule) => Rule.min(0),
        }),
        defineField({
          name: "reserved",
          type: "number",
          title: "Reserved Quantity",
          validation: (Rule) => Rule.min(0),
          initialValue: 0,
        }),
        defineField({
          name: "status",
          type: "string",
          title: "Stock Status",
          options: {
            list: [
              { title: "In Stock", value: "in_stock" },
              { title: "Low Stock", value: "low_stock" },
              { title: "Out of Stock", value: "out_of_stock" },
              { title: "Backorder", value: "backorder" },
            ],
          },
          initialValue: "out_of_stock",
        }),
        defineField({
          name: "warehouse",
          type: "reference",
          to: [{ type: "warehouse" }],
          title: "Warehouse",
        }),
      ],
    }),
    defineField({
      name: "images",
      type: "object",
      title: "Variant Images",
      fields: [
        defineField({
          name: "primary",
          type: "image",
          title: "Primary Image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
            },
          ],
        }),
        defineField({
          name: "gallery",
          type: "array",
          title: "Gallery Images",
          of: [
            {
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: "alt",
                  type: "string",
                  title: "Alt Text",
                },
                {
                  name: "displayOrder",
                  type: "number",
                  title: "Display Order",
                  initialValue: 0,
                },
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "dimensions",
      type: "object",
      title: "Product Dimensions",
      fields: [
        defineField({
          name: "weight",
          type: "number",
          title: "Weight (kg)",
        }),
        defineField({
          name: "length",
          type: "number",
          title: "Length (cm)",
        }),
        defineField({
          name: "width",
          type: "number",
          title: "Width (cm)",
        }),
        defineField({
          name: "height",
          type: "number",
          title: "Height (cm)",
        }),
      ],
    }),
  ],
});
