import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { subcategoryType } from "./subCategoryTypes";
import { productType } from "./productType";
import { productVariantType } from "./productVariantTypes";
import { productVariantValueType } from "./productVariantValueTypes";
import { productImageType } from "./productImageTypes";
import { ProductVariantStockType } from "./productVariantStockType";
import { brandType } from "./brandType";
import { discountType } from "./discountType";
import { productReviewType } from "./reviewsType";
import { userType } from "./userType";
import { reviewImageType } from "./reviewImages";
import { productWishlistType } from "./wishListType";
import { relatedProduct } from "./relatedProductType";
import { orderType } from "./orderType";
import { orderItemType } from "./orderItemType";
import { addressType } from "./addressType";
import { paymentType } from "./paymentType";
import { shippingMethodType } from "./shippingMethodType";
import { cartType } from "./cartType";
import { pageType } from "./pageType";
import { bannerType } from "./bannerType";
import { roleType } from "./roleType";
import { inventoryType } from "./inventoryType";
import { warehouseType } from "./warehouseType";
import { auditLogType } from "./auditLogType";
import { analyticsType } from "./analyticsType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    subcategoryType,
    productType,
    productVariantType,
    productVariantValueType,
    productImageType,
    ProductVariantStockType,
    brandType,
    discountType,
    productReviewType,
    userType,
    reviewImageType,
    productWishlistType,
    relatedProduct,
    orderType,
    orderItemType,
    addressType,
    paymentType,
    shippingMethodType,
    cartType,
    pageType,
    bannerType,
    roleType,
    inventoryType,
    warehouseType,
    auditLogType,
    analyticsType,
  ],
};
