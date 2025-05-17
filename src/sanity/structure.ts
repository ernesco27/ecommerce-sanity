import {
  BoxesIcon,
  CircleDollarSign,
  FileTextIcon,
  Heart,
  ImageIcon,
  Landmark,
  PackageIcon,
  Settings,
  ShoppingCart,
  Star,
  TagIcon,
  Truck,
  UserIcon,
  Activity,
  ChartBar,
  Download,
  FileClock,
} from "lucide-react";
import {
  type StructureBuilder,
  type DefaultDocumentNodeResolver,
} from "sanity/desk";
import { type ComponentType } from "react";
import { AuditLogsViewer } from "./components/AuditLogsViewer";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { ReportGenerator } from "./components/ReportGenerator";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S: StructureBuilder) =>
  S.list()
    .title("E-commerce Dashboard")
    .items([
      // Products & Categories
      S.listItem()
        .title("Catalog Management")
        .icon(BoxesIcon)
        .child(
          S.list()
            .title("Catalog Management")
            .items([
              S.listItem()
                .title("Categories")
                .icon(TagIcon)
                .child(S.documentTypeList("category")),
              S.listItem()
                .title("Products")
                .icon(ShoppingCart)
                .child(S.documentTypeList("product")),

              // S.listItem()
              //   .title("Subcategories")
              //   .icon(TagIcon)
              //   .child(S.documentTypeList("subcategory")),
              S.listItem()
                .title("Brands")
                .icon(Landmark)
                .child(S.documentTypeList("brand")),
              // S.listItem()
              //   .title("Product Variants")
              //   .schemaType("productVariant")
              //   .child(S.documentTypeList("productVariant")),
              // S.listItem()
              //   .title("Product Images")
              //   .icon(ImageIcon)
              //   .child(S.documentTypeList("productImage")),
              // S.listItem()
              //   .title("Related Products")
              //   .icon(ImageIcon)
              //   .child(S.documentTypeList("relatedProduct")),
            ]),
        ),

      S.divider(),

      // Static Pages
      S.listItem()
        .title("Static Pages")
        .icon(FileTextIcon)
        .child(
          S.list()
            .title("Static Pages")
            .items([
              S.listItem()
                .title("About & Contact")
                .child(
                  S.documentList()
                    .title("About & Contact Pages")
                    .filter(
                      '_type == "page" && (pageType == "about" || pageType == "contact")',
                    ),
                ),
              S.listItem()
                .title("Legal & Policies")
                .child(
                  S.documentList()
                    .title("Legal & Policy Pages")
                    .filter(
                      '_type == "page" && (pageType == "terms" || pageType == "privacy" || pageType == "shipping" || pageType == "return")',
                    ),
                ),
              S.listItem()
                .title("FAQ")
                .child(
                  S.documentList()
                    .title("FAQ Pages")
                    .filter('_type == "page" && pageType == "faq"'),
                ),
              S.listItem()
                .title("Custom Pages")
                .child(
                  S.documentList()
                    .title("Custom Pages")
                    .filter('_type == "page" && pageType == "custom"'),
                ),
              S.listItem().title("All Pages").child(S.documentTypeList("page")),
            ]),
        ),

      S.divider(),

      // Orders & Customers
      S.listItem()
        .title("Sales & Customers")
        .icon(PackageIcon)
        .child(
          S.list()
            .title("Sales & Customers")
            .items([
              S.listItem()
                .title("Orders")
                .icon(PackageIcon)
                .child(S.documentTypeList("order")),
              S.listItem()
                .title("Customers")
                .icon(UserIcon)
                .child(S.documentTypeList("user")),
              S.listItem()
                .title("Shopping Carts")
                .icon(ShoppingCart)
                .child(S.documentTypeList("cart")),
            ]),
        ),

      S.divider(),

      // Marketing & Promotions
      S.listItem()
        .title("Marketing & Promotions")
        .icon(CircleDollarSign)
        .child(
          S.list()
            .title("Marketing & Promotions")
            .items([
              S.listItem()
                .title("Discounts")
                .icon(CircleDollarSign)
                .child(S.documentTypeList("discount")),
              S.listItem()
                .title("Reviews")
                .icon(Star)
                .child(S.documentTypeList("productReview")),
              S.listItem()
                .title("Wishlists")
                .icon(Heart)
                .child(S.documentTypeList("productWishlist")),
            ]),
        ),

      S.divider(),

      // Settings & Configuration
      S.listItem()
        .title("Settings & Configuration")
        .icon(Settings)
        .child(
          S.list()
            .title("Settings & Configuration")
            .items([
              S.listItem()
                .title("Shipping Methods")
                .icon(Truck)
                .child(S.documentTypeList("shippingMethod")),
              S.listItem()
                .title("Payment Settings")
                .schemaType("payment")
                .child(S.documentTypeList("payment")),
              S.listItem()
                .title("Addresses")
                .child(S.documentTypeList("address")),
            ]),
        ),

      // Reports & Analytics
      S.listItem()
        .title("Reports & Analytics")
        .icon(ChartBar)
        .child(
          S.list()
            .title("Reports & Analytics")
            .items([
              // Audit Logs Viewer
              S.listItem()
                .title("Audit Logs")
                .icon(Activity)
                .child(
                  S.component()
                    .title("Audit Logs")
                    .component(AuditLogsViewer as ComponentType<any>),
                ),

              // Analytics Dashboard
              S.listItem()
                .title("Analytics Dashboard")
                .icon(ChartBar)
                .child(
                  S.component()
                    .title("Analytics Dashboard")
                    .component(AnalyticsDashboard as ComponentType<any>),
                ),

              // Report Generator
              S.listItem()
                .title("Generate Reports")
                .icon(Download)
                .child(
                  S.component()
                    .title("Generate Reports")
                    .component(ReportGenerator as ComponentType<any>),
                ),

              // Raw Audit Logs (for debugging)
              S.listItem()
                .title("Raw Audit Logs")
                .icon(FileClock)
                .child(S.documentTypeList("auditLog")),
            ]),
        ),

      S.divider(),

      // Hidden Document Types
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            "product",
            "category",
            "subcategory",
            "brand",
            "productVariant",
            "productImage",
            "order",
            "user",
            "cart",
            "discount",
            "productReview",
            "productWishlist",
            "shippingMethod",
            "payment",
            "address",
            "blockContent",
            "reviewImage",
            "orderItem",
            "relatedProduct",
            "productVariantValue",
            "page",
            "auditLog",
            "analytics",
          ].includes(listItem.getId() ?? ""),
      ),
    ]);

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S) =>
  S.document();
