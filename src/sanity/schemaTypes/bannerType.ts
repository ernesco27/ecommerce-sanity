import { SlidersHorizontal } from "lucide-react";
import { defineField, defineType } from "sanity";

export const bannerType = defineType({
  name: "banner",
  type: "document",
  title: "Banners & Slides",
  icon: SlidersHorizontal,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Banner Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subTitle",
      type: "string",
      title: "Sub Title",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      rows: 3,
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Banner Image",
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Banner Location",
      description:
        "Identifier for where this banner should appear (e.g., 'home-hero', 'category-top')",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      type: "string",
      title: "Button Link",
      description: "URL where the banner button should lead to",
    }),
    defineField({
      name: "buttonText",
      type: "string",
      title: "Button Text",
      initialValue: "Shop Now",
    }),
    defineField({
      name: "displayOrder",
      type: "number",
      title: "Display Order",
      description:
        "Order in which banners should appear (lower numbers appear first)",
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "isActive",
      type: "boolean",
      title: "Active",
      description: "Whether this banner is currently active",
      initialValue: true,
    }),
    defineField({
      name: "startDate",
      type: "datetime",
      title: "Start Date",
      description: "When this banner should start appearing",
    }),
    defineField({
      name: "endDate",
      type: "datetime",
      title: "End Date",
      description: "When this banner should stop appearing",
    }),
    defineField({
      name: "bannerType",
      type: "string",
      title: "Banner Type",
      options: {
        list: [
          { title: "Hero Slider", value: "hero" },
          { title: "Promotional Banner", value: "promo" },
          { title: "Category Banner", value: "category" },
          { title: "Sale Banner", value: "sale" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "textColor",
      type: "string",
      title: "Text Color",
      description: "Color for the banner text (hex code or color name)",
      initialValue: "white",
    }),
    defineField({
      name: "backgroundColor",
      type: "string",
      title: "Background Color",
      description:
        "Background color when image is not fully loaded (hex code or color name)",
      initialValue: "black",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "bannerType",
      media: "image",
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title: title || "Untitled Banner",
        subtitle: subtitle ? `Type: ${subtitle}` : "",
        media: media,
      };
    },
  },
});
