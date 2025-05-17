import { Box } from "lucide-react";
import { defineField, defineType } from "sanity";

export const inventoryType = defineType({
  name: "inventory",
  type: "document",
  title: "Inventory",
  icon: Box,
  fields: [
    defineField({
      name: "product",
      type: "reference",
      to: [{ type: "product" }],
      title: "Product",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "variant",
      type: "reference",
      to: [{ type: "productVariant" }],
      title: "Product Variant",
    }),
    defineField({
      name: "warehouse",
      type: "reference",
      to: [{ type: "warehouse" }],
      title: "Warehouse",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "quantity",
      type: "number",
      title: "Current Quantity",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "minStockLevel",
      type: "number",
      title: "Minimum Stock Level",
      description: "Threshold for low stock alerts",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "maxStockLevel",
      type: "number",
      title: "Maximum Stock Level",
      description: "Maximum storage capacity",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "reorderPoint",
      type: "number",
      title: "Reorder Point",
      description: "Quantity at which to reorder stock",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "reorderQuantity",
      type: "number",
      title: "Reorder Quantity",
      description: "Suggested quantity to order when restocking",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "stockStatus",
      type: "string",
      title: "Stock Status",
      options: {
        list: [
          { title: "In Stock", value: "in_stock" },
          { title: "Low Stock", value: "low_stock" },
          { title: "Out of Stock", value: "out_of_stock" },
          { title: "Discontinued", value: "discontinued" },
          { title: "On Order", value: "on_order" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lastStockCheck",
      type: "datetime",
      title: "Last Stock Check",
      description: "Date and time of last physical inventory check",
    }),
    defineField({
      name: "stockMovements",
      type: "array",
      title: "Stock Movements",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "date",
              type: "datetime",
              title: "Movement Date",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "type",
              type: "string",
              title: "Movement Type",
              options: {
                list: [
                  { title: "Stock In", value: "stock_in" },
                  { title: "Stock Out", value: "stock_out" },
                  { title: "Adjustment", value: "adjustment" },
                  { title: "Return", value: "return" },
                  { title: "Damage", value: "damage" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "quantity",
              type: "number",
              title: "Quantity",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "reference",
              type: "string",
              title: "Reference",
              description: "Order number, return ID, etc.",
            }),
            defineField({
              name: "notes",
              type: "text",
              title: "Notes",
            }),
            defineField({
              name: "performedBy",
              type: "reference",
              to: [{ type: "user" }],
              title: "Performed By",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "notes",
      type: "text",
      title: "Notes",
      description: "Additional information about this inventory item",
    }),
  ],
  preview: {
    select: {
      title: "product.name",
      subtitle: "quantity",
      warehouse: "warehouse.name",
    },
    prepare(selection) {
      const { title, subtitle, warehouse } = selection;
      return {
        title: title || "Untitled Product",
        subtitle: `Qty: ${subtitle || 0} @ ${warehouse || "Unknown Location"}`,
      };
    },
  },
});
