import { UserIcon } from "@sanity/icons";
import { defineType, defineField } from "sanity";

export const userType = defineType({
  name: "user",
  type: "document",
  title: "User",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "username",
      type: "string",
      title: "Username",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "image",
      type: "string",
      title: "Image",
    }),
    defineField({
      name: "email",
      type: "string",
      title: "Email",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "phone",
      type: "string",
      title: "Phone Number",
    }),

    defineField({
      name: "accounts",
      title: "Accounts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "account" }] }],
      readOnly: true,
      description: "Accounts are managed from the Account documents.",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      media: "photo",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || "Unnamed User",
        subtitle: subtitle || "No email",
        media: media,
      };
    },
  },
});
