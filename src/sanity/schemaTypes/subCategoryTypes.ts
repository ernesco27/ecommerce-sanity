import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const subcategoryType = defineType({
  name: "subcategory",
  type: "document",
  title: "Subcategory",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Subcategory Name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "URL Slug",
      description: "Unique URL-friendly identifier",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "Brief description of the subcategory",
      validation: (Rule) => Rule.min(10).max(500),
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Subcategory Image",
      description: "Main image for the subcategory",
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
      name: "parentCategory",
      type: "reference",
      to: [{ type: "category" }],
      title: "Parent Category",
      description: "The main category this subcategory belongs to",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "displayOrder",
      type: "number",
      title: "Display Order",
      description:
        "Order in which the subcategory appears (lower numbers appear first)",
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "isActive",
      type: "boolean",
      title: "Active",
      description: "Whether this subcategory is currently active",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      type: "boolean",
      title: "Featured Subcategory",
      description: "Show this subcategory prominently in the store",
      initialValue: false,
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "object",
      description: "Search engine optimization settings",
      fields: [
        defineField({
          name: "metaTitle",
          type: "string",
          title: "Meta Title",
          description: "Title used for search engines (max 60 characters)",
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: "metaDescription",
          type: "text",
          title: "Meta Description",
          description: "Description for search engines (max 160 characters)",
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: "keywords",
          type: "array",
          of: [{ type: "string" }],
          title: "Keywords",
          description: "Keywords for search engines",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "parentCategory.title",
      media: "image",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || "Untitled Subcategory",
        subtitle: subtitle ? `Parent: ${subtitle}` : "No parent category",
        media: media,
      };
    },
  },
});
