import { Landmark } from "lucide-react";
import { defineField, defineType } from "sanity";

export const brandType = defineType({
  name: "brand",
  type: "document",
  title: "Brand",
  icon: Landmark,
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Brand Name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      description: "Unique URL-friendly identifier",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      type: "image",
      title: "Brand Logo",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessibility.",
        },
      ],
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "Brief description of the brand",
      validation: (Rule) => Rule.min(10).max(1000),
    }),
    defineField({
      name: "website",
      type: "url",
      title: "Official Website",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "founded",
      type: "date",
      title: "Founded Date",
      description: "When the brand was established",
    }),
    defineField({
      name: "country",
      type: "string",
      title: "Country of Origin",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      title: "Featured Brand",
      description: "Show this brand prominently in the store",
      initialValue: false,
    }),
    defineField({
      name: "status",
      type: "string",
      title: "Status",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Inactive", value: "inactive" },
        ],
      },
      initialValue: "active",
    }),
    defineField({
      name: "socialMedia",
      type: "object",
      title: "Social Media Links",
      fields: [
        defineField({ name: "facebook", type: "url", title: "Facebook" }),
        defineField({ name: "instagram", type: "url", title: "Instagram" }),
        defineField({ name: "twitter", type: "url", title: "Twitter" }),
        defineField({ name: "linkedin", type: "url", title: "LinkedIn" }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "country",
      media: "logo",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || "Untitled Brand",
        subtitle: subtitle ? `Origin: ${subtitle}` : "",
        media: media,
      };
    },
  },
});
