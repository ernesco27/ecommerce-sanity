import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      type: "string",
      title: "Product Status",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Active", value: "active" },
          { title: "Discontinued", value: "discontinued" },
          { title: "Scheduled", value: "scheduled" },
        ],
      },
      initialValue: "draft",
    }),
    defineField({
      name: "visibility",
      type: "object",
      title: "Visibility Settings",
      fields: [
        defineField({
          name: "isVisible",
          type: "boolean",
          title: "Visible in Store",
          initialValue: false,
        }),
        defineField({
          name: "publishDate",
          type: "datetime",
          title: "Publish Date",
        }),
        defineField({
          name: "unpublishDate",
          type: "datetime",
          title: "Unpublish Date",
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
          description: "Title used for search engines and browser tabs",
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          description: "Description for search engines",
          validation: (Rule) => Rule.max(160),
        }),
        defineField({
          name: "keywords",
          title: "Keywords",
          type: "array",
          of: [{ type: "string" }],
          description: "Keywords for search engines",
        }),
        defineField({
          name: "canonicalUrl",
          title: "Canonical URL",
          type: "url",
          description: "The preferred URL for this product",
        }),
        defineField({
          name: "structuredData",
          title: "Structured Data",
          type: "object",
          fields: [
            defineField({
              name: "brand",
              type: "reference",
              to: [{ type: "brand" }],
            }),
            defineField({
              name: "category",
              type: "reference",
              to: [{ type: "category" }],
            }),
            defineField({
              name: "manufacturer",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fullDescription",
      type: "blockContent",
      title: "Full Description",
    }),
    defineField({
      name: "images",
      type: "object",
      title: "Product Images",
      fields: [
        defineField({
          name: "primary",
          type: "image",
          title: "Primary Image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
              validation: (Rule) => Rule.required(),
            },
          ],
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "gallery",
          type: "array",
          title: "Gallery Images",
          of: [
            {
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: "alt",
                  type: "string",
                  title: "Alt Text",
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: "displayOrder",
                  type: "number",
                  title: "Display Order",
                  initialValue: 0,
                },
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "variants",
      type: "array",
      title: "Product Variants",
      of: [{ type: "reference", to: [{ type: "productVariant" }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "attributes",
      type: "array",
      title: "Available Attributes",
      description: "Attributes that can be used to create variants",
      of: [{ type: "reference", to: [{ type: "productAttribute" }] }],
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      title: "Primary Category",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "additionalCategories",
      type: "array",
      title: "Additional Categories",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({
      name: "brand",
      type: "reference",
      to: [{ type: "brand" }],
      title: "Brand",
    }),
    defineField({
      name: "taxInfo",
      title: "Tax Information",
      type: "object",
      fields: [
        defineField({
          name: "taxCategory",
          title: "Tax Category",
          type: "string",
          options: {
            list: [
              { title: "Standard Rate", value: "standard" },
              { title: "Reduced Rate", value: "reduced" },
              { title: "Zero Rate", value: "zero" },
              { title: "Exempt", value: "exempt" },
            ],
          },
        }),
        defineField({
          name: "taxRate",
          title: "Tax Rate (%)",
          type: "number",
        }),
        defineField({
          name: "hsnCode",
          title: "HSN/SAC Code",
          type: "string",
          description: "Harmonized System Nomenclature code",
        }),
      ],
    }),
    defineField({
      name: "reviews",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productReview" }] }],
      title: "Reviews",
    }),
    defineField({
      name: "relatedProducts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      title: "Related Products",
      validation: (Rule) => Rule.unique(),
    }),
  ],
});
