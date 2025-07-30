import { defineType, defineField } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const accountType = defineType({
  name: "account",
  title: "Account",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "user",
      type: "reference",
      to: [{ type: "user" }],
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
    defineField({
      name: "accountStatus",
      type: "string",
      title: "Account Status",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Inactive", value: "inactive" },
          { title: "Suspended", value: "suspended" },
          { title: "Pending Verification", value: "pending" },
        ],
      },
      initialValue: "active",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "dateJoined",
      type: "datetime",
      title: "Date Joined",
      readOnly: true,
    }),
    defineField({
      name: "lastLogin",
      type: "datetime",
      title: "Last Login",
      readOnly: true,
    }),
    // Account Preferences
    defineField({
      name: "preferences",
      type: "object",
      title: "Account Preferences",
      fields: [
        defineField({
          name: "language",
          type: "string",
          title: "Preferred Language",
          options: {
            list: [
              { title: "English", value: "en" },
              { title: "Spanish", value: "es" },
              { title: "French", value: "fr" },
              // Add more languages as needed
            ],
          },
          initialValue: "en",
        }),
        defineField({
          name: "currency",
          type: "string",
          title: "Preferred Currency",
          options: {
            list: [
              { title: "GHS (₵)", value: "GHS" },
              { title: "USD ($)", value: "USD" },
              { title: "EUR (€)", value: "EUR" },
              { title: "GBP (£)", value: "GBP" },
              // Add more currencies as needed
            ],
          },
          initialValue: "GHS",
        }),
        defineField({
          name: "notifications",
          type: "object",
          title: "Notification Settings",
          fields: [
            defineField({
              name: "email",
              type: "boolean",
              title: "Email Notifications",
              initialValue: true,
            }),
            defineField({
              name: "sms",
              type: "boolean",
              title: "SMS Notifications",
              initialValue: false,
            }),
            defineField({
              name: "push",
              type: "boolean",
              title: "Push Notifications",
              initialValue: true,
            }),
          ],
        }),
      ],
    }),
    // Marketing Preferences
    defineField({
      name: "marketingPreferences",
      type: "object",
      title: "Marketing Preferences",
      fields: [
        defineField({
          name: "emailMarketing",
          type: "boolean",
          title: "Email Marketing",
          description: "Receive promotional emails and newsletters",
          initialValue: true,
        }),
        defineField({
          name: "smsMarketing",
          type: "boolean",
          title: "SMS Marketing",
          description: "Receive promotional SMS messages",
          initialValue: false,
        }),
        defineField({
          name: "personalization",
          type: "boolean",
          title: "Personalized Recommendations",
          description: "Allow personalized product recommendations",
          initialValue: true,
        }),
        defineField({
          name: "thirdPartySharing",
          type: "boolean",
          title: "Third Party Data Sharing",
          description: "Allow sharing data with trusted partners",
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: "productReviews",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productReview" }] }],
      title: "Product Reviews",
    }),
    defineField({
      name: "wishlist",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productWishlist" }] }],
      title: "Wishlist",
    }),
    defineField({
      name: "productLikes",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      title: "Product Likes",
      description: "Products that the user has liked",
    }),
    defineField({
      name: "isEmailVerified",
      type: "boolean",
      title: "Email Verified",
      initialValue: false,
    }),

    defineField({
      name: "addresses",
      type: "array",
      title: "Addresses",
      of: [{ type: "reference", to: [{ type: "address" }] }],
      description: "User's shipping and billing addresses",
    }),
  ],
  preview: {
    select: {
      subtitle: "provider",
      userName: "user.name",
    },
    prepare(selection) {
      const { subtitle, userName } = selection;
      return {
        title: userName || "Unnamed Account",
        subtitle: `Provider: ${subtitle || "Not specified"}`,
        media: UsersIcon,
      };
    },
  },
});
