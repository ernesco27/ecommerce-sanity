import { defineType, defineField } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const addressType = defineType({
  name: "address",
  type: "document",
  title: "Address",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "addressType",
      type: "string",
      title: "Address Type",
      options: {
        list: [
          { title: "Shipping", value: "shipping" },
          { title: "Billing", value: "billing" },
          { title: "Both", value: "both" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "user",
      type: "reference",
      title: "User",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fullName",
      type: "string",
      title: "Full Name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "addressLine1",
      type: "string",
      title: "Address Line 1",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "addressLine2",
      type: "string",
      title: "Address Line 2",
    }),
    defineField({
      name: "city",
      type: "string",
      title: "City",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "state",
      type: "string",
      title: "State",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "postalCode",
      type: "string",
      title: "Postal Code",
    }),
    defineField({
      name: "country",
      type: "string",
      title: "Country",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      type: "string",
      title: "Phone",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isDefault",
      type: "boolean",
      title: "Default Address",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "fullName",
      subtitle: "addressLine1",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || "Unnamed Address",
        subtitle: subtitle || "No address line",
      };
    },
  },
});
