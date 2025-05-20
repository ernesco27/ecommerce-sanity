import { UserIcon } from "@sanity/icons";
import { defineType, defineField } from "sanity";

export const userType = defineType({
  name: "user",
  type: "document",
  title: "User",
  icon: UserIcon,
  fields: [
    defineField({
      name: "firstName",
      type: "string",
      title: "First Name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lastName",
      type: "string",
      title: "Last Name",
      validation: (Rule) => Rule.required(),
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
    // defineField({
    //   name: "photo",
    //   type: "image",
    //   title: "Photo",
    //   options: { hotspot: true },
    // }),
    // Account Status and Details
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
    // defineField({
    //   name: "accountType",
    //   type: "string",
    //   title: "Account Type",
    //   options: {
    //     list: [
    //       { title: "Regular", value: "regular" },
    //       { title: "Premium", value: "premium" },
    //       { title: "Business", value: "business" },
    //     ],
    //   },
    //   initialValue: "regular",
    // }),
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
      name: "roles",
      type: "array",
      title: "User Roles",
      of: [{ type: "reference", to: [{ type: "role" }] }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isEmailVerified",
      type: "boolean",
      title: "Email Verified",
      initialValue: false,
    }),
    defineField({
      name: "isMobileVerified",
      type: "boolean",
      title: "Mobile Verified",
      initialValue: false,
    }),
    defineField({
      name: "twoFactorEnabled",
      type: "boolean",
      title: "Two-Factor Authentication",
      initialValue: false,
    }),
    defineField({
      name: "lastPasswordChange",
      type: "datetime",
      title: "Last Password Change",
      readOnly: true,
    }),
    defineField({
      name: "loginHistory",
      type: "array",
      title: "Login History",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "timestamp",
              type: "datetime",
              title: "Login Time",
            }),
            defineField({
              name: "ipAddress",
              type: "string",
              title: "IP Address",
            }),
            defineField({
              name: "deviceInfo",
              type: "string",
              title: "Device Info",
            }),
            defineField({
              name: "location",
              type: "string",
              title: "Location",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "failedLoginAttempts",
      type: "number",
      title: "Failed Login Attempts",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "accountLocked",
      type: "boolean",
      title: "Account Locked",
      initialValue: false,
      description:
        "Account automatically locks after multiple failed login attempts",
    }),
    defineField({
      name: "lockExpiresAt",
      type: "datetime",
      title: "Lock Expiry Time",
      hidden: true,
    }),
    defineField({
      name: "clerkUserId",
      type: "string",
      title: "Clerk User ID",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "firstName",
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
