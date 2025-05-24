import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import type {
  Rule,
  ReferenceFilterOptions,
  ReferenceFilterResolverContext,
  SanityDocument,
  Reference,
} from "sanity";

interface ProductDocument extends SanityDocument {
  category?: Reference;
}

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
      name: "featured",
      type: "boolean",
      title: "Featured Product",
      description: "Display this product in featured sections",
      initialValue: false,
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "materialType",
      title: "Material Type",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "The main material used in the product",
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
      description: "Add size variants with their prices and color options",
      of: [{ type: "reference", to: [{ type: "productVariant" }] }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      title: "Primary Category",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subcategory",
      type: "array",
      title: "Subcategory",
      description: "Select subcategory from the primary category",
      of: [
        {
          type: "reference",
          to: [{ type: "subcategory" }],
          options: {
            disableNew: true,
            filter: ({ document }: { document?: ProductDocument }) => {
              if (!document?.category?._ref) return false;
              return {
                filter: "parentCategory._ref == $categoryId",
                params: { categoryId: document.category._ref },
              };
            },
          },
        },
      ],
      hidden: ({ document }) => !document?.category,
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "brand",
      type: "reference",
      to: [{ type: "brand" }],
      title: "Brand",
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
      ],
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
    defineField({
      name: "stockSummary",
      type: "object",
      title: "Stock Summary",
      readOnly: true,
      fields: [
        defineField({
          name: "totalStock",
          type: "number",
          title: "Total Stock",
          description: "Aggregated stock across all variants",
        }),
        defineField({
          name: "lowStockVariants",
          type: "number",
          title: "Low Stock Variants",
          description: "Number of variants below minimum stock level",
        }),
        defineField({
          name: "outOfStockVariants",
          type: "number",
          title: "Out of Stock Variants",
          description: "Number of variants with zero stock",
        }),
        defineField({
          name: "lastUpdated",
          type: "datetime",
          title: "Last Stock Update",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "status",
      media: "images.primary",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled Product",
        subtitle: `${subtitle || "Draft"}`,
        media: media,
      };
    },
  },
});
