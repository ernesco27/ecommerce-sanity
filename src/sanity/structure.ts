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
  Box,
  LineChart,
  Users,
  Building2,
} from "lucide-react";
import {
  type StructureBuilder,
  type DefaultDocumentNodeResolver,
} from "sanity/desk";

import { AuditLogsViewer } from "./components/AuditLogsViewer";

import { ReportGenerator } from "./components/ReportGenerator";

import { StockDashboard } from "./components/dashboards/StockDashboard";
import { SalesDashboard } from "./components/dashboards/SalesDashboard";
import { CustomerDashboard } from "./components/dashboards/CustomerDashboard";
import { OrderDashboard } from "./components/dashboards/OrderDashboard";
import OrdersTable from "../components/sanity/orders/OrdersTable";

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
                .child(
                  S.list()
                    .title("Orders")
                    .items([
                      S.listItem()
                        .title("All Orders")
                        .child(
                          S.component(OrdersTable)
                            .title("Orders")
                            .id("orders-table"),
                        ),
                      S.listItem()
                        .title("Manage Orders")
                        .child(
                          S.documentTypeList("order").title("Manage Orders"),
                        ),
                    ]),
                ),
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
                .title("Company Settings")
                .icon(Building2)
                .child(
                  S.editor()
                    .id("companySettings")
                    .schemaType("companySettings")
                    .documentId("companySettings"),
                ),
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
              // Dashboards
              S.listItem()
                .title("Stock Dashboard")
                .icon(Box)
                .child(
                  S.component(StockDashboard)
                    .title("Stock Dashboard")
                    .id("stock-dashboard"),
                ),

              S.listItem()
                .title("Sales Dashboard")
                .icon(LineChart)
                .child(
                  S.component(SalesDashboard)
                    .title("Sales Dashboard")
                    .id("sales-dashboard"),
                ),

              S.listItem()
                .title("Customer Dashboard")
                .icon(Users)
                .child(
                  S.component(CustomerDashboard)
                    .title("Customer Dashboard")
                    .id("customer-dashboard"),
                ),

              S.listItem()
                .title("Order Dashboard")
                .icon(ShoppingCart)
                .child(
                  S.component(OrderDashboard)
                    .title("Order Dashboard")
                    .id("order-dashboard"),
                ),

              S.divider(),

              // Reports Generator
              S.listItem()
                .title("Generate Reports")
                .icon(Download)
                .child(
                  S.component(ReportGenerator)
                    .title("Generate Reports")
                    .id("report-generator"),
                ),

              S.divider(),

              // Raw Data Views
              S.listItem()
                .title("Analytics Data")
                .icon(ChartBar)
                .child(
                  S.documentTypeList("analytics")
                    .title("Analytics Data")
                    .filter('_type == "analytics"'),
                ),

              S.listItem()
                .title("Audit Logs")
                .icon(Activity)
                .child(
                  S.component(AuditLogsViewer)
                    .title("Audit Logs")
                    .id("audit-logs"),
                ),
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
            "productAttribute",
            "page",
            "auditLog",
            "analytics",
            "role",
            "companySettings",
          ].includes(listItem.getId() ?? ""),
      ),
    ]);

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S) =>
  S.document();
