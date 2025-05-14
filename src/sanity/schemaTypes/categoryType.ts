import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Category Name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "URL Slug",
      description: "Unique URL-friendly identifier",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "Brief description of the category",
      validation: (Rule) => Rule.min(10).max(500),
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Category Image",
      description: "Main image for the category",
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
      name: "icon",
      type: "image",
      title: "Category Icon",
      description: "Small icon for navigation and mobile display",
      options: {
        hotspot: true,
        accept: ".svg,.png",
      },
    }),
    defineField({
      name: "subcategories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "subcategory" }] }],
      title: "Subcategories",
      description: "List of subcategories under this category",
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "displayOrder",
      type: "number",
      title: "Display Order",
      description:
        "Order in which the category appears (lower numbers appear first)",
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "isActive",
      type: "boolean",
      title: "Active",
      description: "Whether this category is currently active",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      type: "boolean",
      title: "Featured Category",
      description: "Show this category prominently in the store",
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
      title: "title",
      subtitle: "description",
      media: "image",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || "Untitled Category",
        subtitle: subtitle ? subtitle.slice(0, 50) + "..." : "",
        media: media,
      };
    },
  },
});
