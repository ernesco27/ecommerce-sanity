import { Product, ProductVariant, Color } from "../../sanity.types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AppliedDiscount {
  _id: string;
  name: string;
  type: "percentage" | "amount" | "bxgy" | "free_shipping";
  value: number;
  amount: number;
  code: string;
}

interface CartItem {
  _id: string;
  name: string;
  quantity: number;
  selectedVariant: {
    _id: string;
    size: string;
    price: number;
    sku: string;
    color: string;
    colorCode?: Color;
    stock: number;
    imageUrl?: string;
  };
}

interface CartStore {
  items: CartItem[];
  hydrated: boolean;
  appliedDiscounts: AppliedDiscount[];
  setHydrated: (state: boolean) => void;
  addItem: (
    product: Product,
    variant: ProductVariant,
    selectedColor: string,
    quantity: number,
    imageUrl?: string,
  ) => { success: boolean; error?: string };
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number,
  ) => { success: boolean; error?: string };
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (
    productId: string,
    variantId: string,
    color: string,
  ) => number;
  applyDiscount: (
    code: string,
  ) => Promise<{ success: boolean; error?: string }>;
  removeDiscount: (discountId: string) => void;
  getDiscountTotal: () => number;
  getFinalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      appliedDiscounts: [],
      setHydrated: (state) => set({ hydrated: state }),

      // Helper function to get current quantity of an item in cart
      getItemQuantity: (
        productId: string,
        variantId: string,
        color: string,
      ) => {
        const state = get();
        const existingItem = state.items.find(
          (item) =>
            item._id === productId &&
            item.selectedVariant._id === variantId &&
            item.selectedVariant.color === color,
        );
        return existingItem?.quantity || 0;
      },

      addItem: (product, variant, selectedColor, quantity = 1, imageUrl) => {
        const state = get();
        const colorVariant = variant.colorVariants?.find(
          (cv) => cv.color === selectedColor,
        );

        if (!colorVariant) {
          return { success: false, error: "Color variant not found" };
        }

        const stock = colorVariant.stock || 0;
        const currentQuantity = state.getItemQuantity(
          product._id || "",
          variant._id,
          selectedColor,
        );
        const newTotalQuantity = currentQuantity + quantity;

        if (newTotalQuantity > stock) {
          return {
            success: false,
            error: `Cannot add ${quantity} items. Only ${stock - currentQuantity} more available.`,
          };
        }

        const existingItem = state.items.find(
          (item) =>
            item._id === product._id &&
            item.selectedVariant._id === variant._id &&
            item.selectedVariant.color === selectedColor,
        );

        set({
          ...state,
          items: existingItem
            ? state.items.map((item) =>
                item._id === product._id &&
                item.selectedVariant._id === variant._id &&
                item.selectedVariant.color === selectedColor
                  ? {
                      ...item,
                      quantity: item.quantity + quantity,
                    }
                  : item,
              )
            : [
                ...state.items,
                {
                  _id: product._id || "",
                  name: product.name || "",
                  quantity,
                  selectedVariant: {
                    _id: variant._id,
                    size: variant.size || "",
                    price: variant.price || 0,
                    sku: variant.sku || "",
                    color: selectedColor,
                    colorCode: colorVariant.colorCode || undefined,
                    stock: stock,
                    imageUrl:
                      imageUrl ||
                      (colorVariant.images?.[0]?.asset?._ref
                        ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${colorVariant.images[0].asset._ref
                            .replace("image-", "")
                            .replace("-jpg", ".jpg")
                            .replace("-png", ".png")
                            .replace("-webp", ".webp")}`
                        : undefined),
                  },
                },
              ],
        });

        return { success: true };
      },

      updateQuantity: (productId, variantId, newQuantity) => {
        const state = get();
        const item = state.items.find(
          (item) =>
            item._id === productId && item.selectedVariant._id === variantId,
        );

        if (!item) {
          return { success: false, error: "Item not found in cart" };
        }

        if (newQuantity > item.selectedVariant.stock) {
          return {
            success: false,
            error: `Cannot set quantity to ${newQuantity}. Only ${item.selectedVariant.stock} available.`,
          };
        }

        set({
          ...state,
          items: state.items.map((item) =>
            item._id === productId && item.selectedVariant._id === variantId
              ? { ...item, quantity: newQuantity }
              : item,
          ),
        });

        return { success: true };
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          ...state,
          items: state.items.filter(
            (item) =>
              !(
                item._id === productId && item.selectedVariant._id === variantId
              ),
          ),
        }));
      },

      clearCart: () => {
        set((state) => ({ ...state, items: [] }));
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.selectedVariant.price * item.quantity,
          0,
        );
      },

      applyDiscount: async (code: string) => {
        try {
          const state = get();
          const response = await fetch("/api/discounts/validate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              code,
              cartItems: state.items,
              // You might want to get userId from your auth context
              userId: null,
            }),
          });

          const data = await response.json();
          console.log("data", data);

          if (!data.success) {
            return { success: false, error: data.error };
          }

          // Check if discount is already applied
          const isAlreadyApplied = state.appliedDiscounts.some(
            (d) => d.code === data.discount.code,
          );

          if (isAlreadyApplied) {
            return { success: false, error: "Discount already applied" };
          }

          set((state) => ({
            appliedDiscounts: [...state.appliedDiscounts, data.discount],
          }));

          return { success: true };
        } catch (error) {
          console.error("Error applying discount:", error);
          return {
            success: false,
            error: "Failed to apply discount. Please try again.",
          };
        }
      },

      removeDiscount: (discountId: string) => {
        set((state) => ({
          appliedDiscounts: state.appliedDiscounts.filter(
            (d) => d._id !== discountId,
          ),
        }));
      },

      getDiscountTotal: () => {
        const state = get();
        return state.appliedDiscounts.reduce(
          (total, discount) => total + discount.amount,
          0,
        );
      },

      getFinalPrice: () => {
        const state = get();
        const subtotal = state.getTotalPrice();
        const discountTotal = state.getDiscountTotal();
        return Math.max(0, subtotal - discountTotal);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
