import { defineType, defineField } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const accountType = defineType({
  name: "account",
  title: "Account",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "userId",
      title: "User ID",
      type: "string",
      validation: (Rule) => Rule.required().error("User ID is required."),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required().error("Name is required."),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "url",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
        }).error("Please provide a valid URL."),
    }),
    defineField({
      name: "password",
      title: "Password",
      type: "string",

      // The following validation rules will only be applied if the field has a value.
      validation: (Rule) =>
        Rule.custom((password) => {
          // If the password field is empty, it's valid (optional)
          if (!password) {
            return true;
          }

          // If there is a password, run the validations
          if (password.length < 6) {
            return "Password must be at least 6 characters long.";
          }
          if (password.length > 100) {
            return "Password cannot exceed 100 characters.";
          }
          if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
          }
          if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter.";
          }
          if (!/[0-9]/.test(password)) {
            return "Password must contain at least one number.";
          }
          if (!/[^a-zA-Z0-9]/.test(password)) {
            return "Password must contain at least one special character.";
          }

          return true; // Password is valid
        }),
    }),
    defineField({
      name: "provider",
      title: "Provider",
      type: "string",
      validation: (Rule) => Rule.required().error("Provider is required."),
    }),
    defineField({
      name: "providerAccountId",
      title: "Provider Account ID",
      type: "string",
      validation: (Rule) =>
        Rule.required().error("Provider Account ID is required."),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "provider",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || "Unnamed Account",
        subtitle: `Provider: ${subtitle || "Not specified"}`,
        media: UsersIcon,
      };
    },
  },
});
