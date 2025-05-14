import {
  BoxesIcon,
  CircleDollarSign,
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
} from "lucide-react";
import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
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
                .title("Products")
                .icon(ShoppingCart)
                .child(S.documentTypeList("product")),
              S.listItem()
                .title("Categories")
                .icon(TagIcon)
                .child(S.documentTypeList("category")),
              S.listItem()
                .title("Subcategories")
                .icon(TagIcon)
                .child(S.documentTypeList("subcategory")),
              S.listItem()
                .title("Brands")
                .icon(Landmark)
                .child(S.documentTypeList("brand")),
              S.listItem()
                .title("Product Variants")
                .schemaType("productVariant")
                .child(S.documentTypeList("productVariant")),
              S.listItem()
                .title("Product Images")
                .icon(ImageIcon)
                .child(S.documentTypeList("productImage")),
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
          ].includes(listItem.getId()!),
      ),
    ]);
