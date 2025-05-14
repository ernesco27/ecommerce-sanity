import { CircleDollarSign } from "lucide-react";
import { defineField, defineType } from "sanity";

export const discountType = defineType({
  name: "discount",
  type: "document",
  title: "Discount",
  icon: CircleDollarSign,
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Discount Name",
      description: "Name of the discount or promotion",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "code",
      type: "string",
      title: "Discount Code",
      description: "Unique code for the discount (if applicable)",
      validation: (Rule) => Rule.uppercase(),
    }),
    defineField({
      name: "type",
      type: "string",
      title: "Discount Type",
      description: "Type of discount to apply",
      options: {
        list: [
          { title: "Percentage Off", value: "percentage" },
          { title: "Fixed Amount Off", value: "amount" },
          { title: "Buy X Get Y", value: "bxgy" },
          { title: "Free Shipping", value: "free_shipping" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "value",
      type: "number",
      title: "Discount Value",
      description: "Amount or percentage of the discount",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "minOrderValue",
      type: "number",
      title: "Minimum Order Value",
      description: "Minimum cart value required to apply the discount",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "maxDiscount",
      type: "number",
      title: "Maximum Discount Amount",
      description:
        "Maximum amount that can be discounted (for percentage discounts)",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "startDate",
      type: "datetime",
      title: "Start Date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      type: "datetime",
      title: "End Date",
      validation: (Rule) => Rule.required().min(Rule.valueOfField("startDate")),
    }),
    defineField({
      name: "isActive",
      type: "boolean",
      title: "Active",
      description: "Whether this discount is currently active",
      initialValue: true,
    }),
    defineField({
      name: "usageLimit",
      type: "object",
      title: "Usage Limits",
      fields: [
        defineField({
          name: "totalUses",
          type: "number",
          title: "Total Uses Limit",
          description: "Maximum number of times this discount can be used",
          validation: (Rule) => Rule.min(0),
        }),
        defineField({
          name: "perCustomer",
          type: "number",
          title: "Uses Per Customer",
          description: "Maximum times a customer can use this discount",
          validation: (Rule) => Rule.min(0),
        }),
      ],
    }),
    defineField({
      name: "applicableTo",
      type: "object",
      title: "Applicable To",
      description: "Define where this discount can be applied",
      fields: [
        defineField({
          name: "products",
          type: "array",
          of: [{ type: "reference", to: [{ type: "product" }] }],
          title: "Specific Products",
        }),
        defineField({
          name: "categories",
          type: "array",
          of: [{ type: "reference", to: [{ type: "category" }] }],
          title: "Product Categories",
        }),
        defineField({
          name: "brands",
          type: "array",
          of: [{ type: "reference", to: [{ type: "brand" }] }],
          title: "Brands",
        }),
      ],
    }),
    defineField({
      name: "exclusions",
      type: "object",
      title: "Exclusions",
      description: "Define what is excluded from this discount",
      fields: [
        defineField({
          name: "products",
          type: "array",
          of: [{ type: "reference", to: [{ type: "product" }] }],
          title: "Excluded Products",
        }),
        defineField({
          name: "categories",
          type: "array",
          of: [{ type: "reference", to: [{ type: "category" }] }],
          title: "Excluded Categories",
        }),
        defineField({
          name: "brands",
          type: "array",
          of: [{ type: "reference", to: [{ type: "brand" }] }],
          title: "Excluded Brands",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      type: "type",
      value: "value",
      isActive: "isActive",
    },
    prepare(selection) {
      const { title, type, value, isActive } = selection;
      const discountValue = type === "percentage" ? `${value}%` : `$${value}`;
      return {
        title: title || "Untitled Discount",
        subtitle: `${discountValue} off - ${isActive ? "Active" : "Inactive"}`,
      };
    },
  },
});
