import { defineType, defineField } from "sanity";
import { Landmark } from "lucide-react";

export const taxSettingsType = defineType({
  name: "taxSettings",
  type: "document",
  title: "Tax Settings",
  icon: Landmark,
  fields: [
    defineField({
      name: "isEnabled",
      type: "boolean",
      title: "Enable Tax",
      description: "Enable or disable tax calculation",
      initialValue: true,
    }),
    defineField({
      name: "defaultRate",
      type: "number",
      title: "Default Tax Rate (%)",
      description: "Default tax rate to apply if no specific rule matches",
      validation: (Rule) => Rule.required().min(0).max(100),
      initialValue: 0,
    }),
    defineField({
      name: "taxRules",
      type: "array",
      title: "Tax Rules",
      description: "Specific tax rules for different regions or conditions",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              type: "string",
              title: "Rule Name",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "rate",
              type: "number",
              title: "Tax Rate (%)",
              validation: (Rule) => Rule.required().min(0).max(100),
            }),
            defineField({
              name: "regions",
              type: "array",
              title: "Applicable Regions",
              description: "Regions where this tax rule applies",
              of: [{ type: "string" }],
            }),
            defineField({
              name: "isDefault",
              type: "boolean",
              title: "Is Default Rule",
              description: "Use this rule as default if no other rules match",
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: "name",
              rate: "rate",
              isDefault: "isDefault",
            },
            prepare({ title, rate, isDefault }) {
              return {
                title: `${title} (${rate}%)`,
                subtitle: isDefault ? "Default Rule" : undefined,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "exemptCategories",
      type: "array",
      title: "Tax Exempt Categories",
      description: "Product categories that are exempt from tax",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({
      name: "exemptProducts",
      type: "array",
      title: "Tax Exempt Products",
      description: "Specific products that are exempt from tax",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "taxIncluded",
      type: "boolean",
      title: "Tax Included in Prices",
      description: "Whether product prices already include tax",
      initialValue: false,
    }),
    defineField({
      name: "displayTax",
      type: "boolean",
      title: "Display Tax Separately",
      description: "Whether to display tax as a separate line item",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      isEnabled: "isEnabled",
      defaultRate: "defaultRate",
    },
    prepare({ isEnabled, defaultRate }) {
      return {
        title: "Tax Settings",
        subtitle: isEnabled
          ? `Enabled (${defaultRate}% default rate)`
          : "Disabled",
      };
    },
  },
});
