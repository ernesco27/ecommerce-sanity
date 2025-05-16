import { FileTextIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const pageType = defineType({
  name: "page",
  type: "document",
  title: "Static Pages",
  icon: FileTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Page Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "URL Slug",
      description: "The URL-friendly version of the page title",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pageType",
      type: "string",
      title: "Page Type",
      options: {
        list: [
          { title: "About Us", value: "about" },
          { title: "Contact Us", value: "contact" },
          { title: "Terms & Conditions", value: "terms" },
          { title: "Privacy Policy", value: "privacy" },
          { title: "Shipping Policy", value: "shipping" },
          { title: "Return Policy", value: "return" },
          { title: "FAQ", value: "faq" },
          { title: "Custom Page", value: "custom" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      type: "blockContent",
      title: "Page Content",
      description: "Rich text content for the page",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sections",
      type: "array",
      title: "Page Sections",
      of: [
        {
          type: "object",
          title: "Section",
          fields: [
            defineField({
              name: "sectionTitle",
              type: "string",
              title: "Section Title",
            }),
            defineField({
              name: "sectionContent",
              type: "blockContent",
              title: "Section Content",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "object",
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
    defineField({
      name: "lastUpdated",
      type: "datetime",
      title: "Last Updated",
      readOnly: true,
    }),
    defineField({
      name: "isPublished",
      type: "boolean",
      title: "Published",
      description: "Whether this page is publicly visible",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "pageType",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || "Untitled Page",
        subtitle: subtitle ? `Type: ${subtitle}` : "No type specified",
      };
    },
  },
});
