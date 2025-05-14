import { Truck } from "lucide-react";
import { defineField } from "sanity";

export const shippingMethodType = {
  name: "shippingMethod",
  title: "Shipping Methods",
  type: "document",
  icon: Truck,
  fields: [
    defineField({
      name: "name",
      title: "Method Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "price",
      title: "Shipping Price",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "estimatedDays",
      title: "Estimated Delivery Days",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isAvailable",
      title: "Is Available",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "restrictions",
      title: "Shipping Restrictions",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "countries",
      title: "Available Countries",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required(),
    }),
  ],
};
