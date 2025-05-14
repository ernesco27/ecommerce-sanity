import { CircleDollarSign } from "lucide-react";
import { defineField, defineType } from "sanity";

export const discountType = defineType({
  name: "discount",
  type: "document",
  title: "Discount",
  icon: CircleDollarSign,
  fields: [
    defineField({ name: "name", type: "string", title: "Name" }),

    defineField({
      name: "type",
      type: "string",
      title: "Type",
      options: {
        list: ["Percentage", "Amount"],
        layout: "radio",
      },
    }),
    defineField({ name: "value", type: "number", title: "Value" }),
    defineField({ name: "startDate", type: "datetime", title: "Start Date" }),
    defineField({ name: "endDate", type: "datetime", title: "End Date" }),
    //defineField({ name: 'isActive', type: 'boolean', title: 'Is Active', initialValue: true }),
    //   defineField({
    //     name: 'products',
    //     type: 'array',
    //     of: [{ type: 'reference', to: [{ type: 'products' }] }],
    //     title: 'Products',
    //   }),
  ],
});
