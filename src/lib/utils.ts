import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ShippingAddress {
  _id: string;
  fullName?: string; // Assuming from your Address schema
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  // A helper to get a formatted string (optional, can be done in component)
  formatted?: string;
  phone?: string;
  email?: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to format address (can be moved to a utils file if used elsewhere)
export const formatAddress = (
  addr: ShippingAddress | null | undefined,
): string => {
  if (!addr) return "N/A";
  const parts = [
    addr.fullName,
    addr.addressLine1,
    addr.addressLine2,
    addr.city,
    addr.state,
    addr.postalCode,
    addr.country,
  ].filter(Boolean); // Filter out null/undefined/empty strings
  return parts.join(", ") || "N/A";
};

export const formatPriceRange = (
  min: number | undefined,
  max: number | undefined,
) => {
  if (min !== undefined && max !== undefined) {
    return `GHC${min} - GHC${max}`;
  }
  if (min !== undefined) {
    return `Over $${min}`;
  }
  if (max !== undefined) {
    return `Under $${max}`;
  }
  return ""; // Should not happen if logic is correct
};
