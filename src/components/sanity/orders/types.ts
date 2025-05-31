export interface OrderItem {
  product: {
    _id: string;
    name: string;
    images?: {
      primary?: {
        url: string;
        alt?: string;
      };
    };
  };
  variant?: {
    variantId?: string;
    color?: string;
    size?: string;
    price?: number;
  };
  quantity: number;
  subtotal?: number;
}

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
}

export interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
  };
  items: Array<OrderItem>;
  shippingAddress: ShippingAddress;
  total: number;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
}
