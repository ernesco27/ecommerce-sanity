import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const warehouseType = defineType({
  name: "warehouse",
  type: "document",
  title: "Warehouses",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Warehouse Name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "code",
      type: "string",
      title: "Warehouse Code",
      validation: (Rule) => Rule.required().uppercase(),
    }),
    defineField({
      name: "address",
      type: "object",
      title: "Address",
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
    defineField({
      name: "contact",
      type: "object",
      title: "Contact Information",
      fields: [
        defineField({
          name: "name",
          type: "string",
          title: "Contact Name",
        }),
        defineField({
          name: "phone",
          type: "string",
          title: "Phone Number",
        }),
        defineField({
          name: "email",
          type: "string",
          title: "Email",
          validation: (Rule) => Rule.email(),
        }),
      ],
    }),
    defineField({
      name: "isActive",
      type: "boolean",
      title: "Active",
      initialValue: true,
    }),
    defineField({
      name: "storageCapacity",
      type: "object",
      title: "Storage Capacity",
      fields: [
        defineField({
          name: "totalArea",
          type: "number",
          title: "Total Area (sq ft)",
        }),
        defineField({
          name: "usableArea",
          type: "number",
          title: "Usable Area (sq ft)",
        }),
        defineField({
          name: "temperatureControlled",
          type: "boolean",
          title: "Temperature Controlled",
        }),
        defineField({
          name: "hazmatCertified",
          type: "boolean",
          title: "Hazmat Certified",
        }),
      ],
    }),
    defineField({
      name: "operatingHours",
      type: "object",
      title: "Operating Hours",
      fields: [
        defineField({
          name: "weekday",
          type: "string",
          title: "Weekday Hours",
        }),
        defineField({
          name: "weekend",
          type: "string",
          title: "Weekend Hours",
        }),
        defineField({
          name: "holidays",
          type: "string",
          title: "Holiday Hours",
        }),
      ],
    }),
    defineField({
      name: "shippingZones",
      type: "array",
      title: "Shipping Zones",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "zoneName",
              type: "string",
              title: "Zone Name",
            }),
            defineField({
              name: "countries",
              type: "array",
              of: [{ type: "string" }],
              title: "Countries",
            }),
            defineField({
              name: "estimatedDelivery",
              type: "string",
              title: "Estimated Delivery Time",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "notes",
      type: "text",
      title: "Notes",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "code",
      location: "address.city",
    },
    prepare(selection) {
      const { title, subtitle, location } = selection;
      return {
        title: title || "Untitled Warehouse",
        subtitle: `${subtitle} - ${location || "No location"}`,
      };
    },
  },
});
