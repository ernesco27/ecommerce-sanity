import { Building2 } from "lucide-react";
import { defineField, defineType } from "sanity";

export const companySettingsType = defineType({
  name: "companySettings",
  type: "document",
  title: "Company Settings",
  icon: Building2,
  fields: [
    // Basic Information
    defineField({
      name: "businessName",
      type: "string",
      title: "Business Name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "legalName",
      type: "string",
      title: "Legal Business Name",
      description: "Official registered name of the business",
    }),
    defineField({
      name: "taxId",
      type: "string",
      title: "Tax ID/VAT Number",
    }),
    // Contact Information
    defineField({
      name: "email",
      type: "string",
      title: "Business Email",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "phone",
      type: "string",
      title: "Primary Phone Number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alternativePhone",
      type: "string",
      title: "Alternative Phone Number",
    }),
    // Address
    defineField({
      name: "address",
      type: "object",
      title: "Business Address",
      fields: [
        defineField({
          name: "street",
          type: "string",
          title: "Street Address",
          validation: (Rule) => Rule.required(),
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
          title: "State/Province",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "postalCode",
          type: "string",
          title: "Postal Code",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "country",
          type: "string",
          title: "Country",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    // Branding
    defineField({
      name: "logo",
      type: "image",
      title: "Company Logo",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Important for SEO and accessibility.",
        },
      ],
    }),
    defineField({
      name: "favicon",
      type: "image",
      title: "Favicon",
      description: "Small icon displayed in browser tabs",
    }),
    defineField({
      name: "brandColors",
      type: "object",
      title: "Brand Colors",
      fields: [
        defineField({
          name: "primary",
          type: "string",
          title: "Primary Color",
          description: "Main brand color (hex code)",
        }),
        defineField({
          name: "secondary",
          type: "string",
          title: "Secondary Color",
          description: "Secondary brand color (hex code)",
        }),
      ],
    }),
    // Social Media
    defineField({
      name: "socialMedia",
      type: "object",
      title: "Social Media Links",
      fields: [
        defineField({ name: "facebook", type: "url", title: "Facebook" }),
        defineField({ name: "instagram", type: "url", title: "Instagram" }),
        defineField({ name: "twitter", type: "url", title: "Twitter" }),
        defineField({ name: "linkedin", type: "url", title: "LinkedIn" }),
        defineField({ name: "youtube", type: "url", title: "YouTube" }),
      ],
    }),
    // Business Hours
    defineField({
      name: "businessHours",
      type: "object",
      title: "Business Hours",
      fields: [
        defineField({
          name: "weekday",
          type: "string",
          title: "Weekday Hours",
          description: "e.g., Mon-Fri: 9:00 AM - 6:00 PM",
        }),
        defineField({
          name: "weekend",
          type: "string",
          title: "Weekend Hours",
          description: "e.g., Sat-Sun: 10:00 AM - 4:00 PM",
        }),
        defineField({
          name: "holidays",
          type: "string",
          title: "Holiday Hours",
        }),
        defineField({
          name: "timeZone",
          type: "string",
          title: "Time Zone",
          description: "e.g., UTC, EST, PST",
        }),
      ],
    }),
    // Additional Information
    defineField({
      name: "currency",
      type: "string",
      title: "Default Currency",
      description: "Primary currency for transactions",
      initialValue: "USD",
    }),
    defineField({
      name: "languages",
      type: "array",
      title: "Supported Languages",
      of: [{ type: "string" }],
      initialValue: ["en"],
    }),
    defineField({
      name: "metaDescription",
      type: "text",
      title: "Meta Description",
      description:
        "Brief description of your business for SEO (max 160 characters)",
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: "businessName",
      subtitle: "email",
      media: "logo",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || "Company Settings",
        subtitle: subtitle || "",
        media: media,
      };
    },
  },
});
