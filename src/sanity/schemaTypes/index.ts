import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { authorType } from "./authorType";
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

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    subcategoryType,
    productType,
    productVariantType,
    //productVariantValueType,
    productImageType,
    ProductVariantStockType,
    brandType,
    discountType,
    productReviewType,
    userType,
    reviewImageType,
    productWishlistType,
    relatedProduct,
  ],
};
