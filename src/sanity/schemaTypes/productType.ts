import { TrolleyIcon } from "@sanity/icons";
import { defineField, validation } from "sanity";

export const productType = {
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
      ],
    }),
    defineField({
      name: "description",
      title: "Product Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fullDescription",
      type: "blockContent",
      title: "Full Description",
    }),
    defineField({
      name: "baseStock",
      type: "number",
      title: "Base Stock",
      description: "Total stock of all variants",
      readOnly: true,
    }),
    defineField({
      name: "price",
      type: "number",
      title: "Price",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "salesPrice",
      type: "number",
      title: "Sales Price",
    }),
    defineField({
      name: "sku",
      type: "string",
      title: "SKU",
      validation: (Rule) => Rule.required(),
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
      name: "shippingDimensions",
      title: "Shipping Dimensions",
      type: "object",
      fields: [
        defineField({
          name: "weight",
          title: "Weight (kg)",
          type: "number",
          validation: (Rule) => Rule.min(0),
        }),
        defineField({
          name: "length",
          title: "Length (cm)",
          type: "number",
          validation: (Rule) => Rule.min(0),
        }),
        defineField({
          name: "width",
          title: "Width (cm)",
          type: "number",
          validation: (Rule) => Rule.min(0),
        }),
        defineField({
          name: "height",
          title: "Height (cm)",
          type: "number",
          validation: (Rule) => Rule.min(0),
        }),
      ],
    }),
    defineField({
      name: "variants",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productVariant" }] }],
      title: "Product Variants",
    }),
    defineField({
      name: "images",
      type: "array",
      of: [{ type: "reference", to: [{ type: "productImage" }] }],
      title: "All Images",
    }),
    defineField({
      name: "isAvailable",
      type: "boolean",
      title: "Is Available",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      type: "boolean",
      title: "Featured",
      initialValue: false,
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      title: "Category",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brand",
      type: "reference",
      to: [{ type: "brand" }],
      title: "Brand",
    }),
    defineField({
      name: "discount",
      type: "reference",
      to: [{ type: "discount" }],
      title: "Discount",
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
      of: [{ type: "reference", to: [{ type: "relatedProduct" }] }],
      title: "Related Products",
    }),
  ],
};
