export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: number | null;
  children?: Category[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_path: string;
  is_primary: boolean;
  display_order: number;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  color: string;
  size: string;
  price?: number;
  sale_price?: number;
  stock_quantity: number;
  status: 'active' | 'inactive';
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  category_id: number;
  category?: Category;
  brand: string;
  price: number;
  sale_price?: number | null;
  is_featured: boolean;
  is_new_arrival: boolean;
  status: 'draft' | 'active' | 'archived';
  size_guide_type?: 'men' | 'women' | 'kids' | null;
  tags?: string[];
  images?: ProductImage[];
  variants?: ProductVariant[];
  reviews?: Review[];
  average_rating?: number;
}

export interface CartItem {
  id: number;
  product_variant_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  variant: {
    id: number;
    sku: string;
    color: string;
    size: string;
    stock_quantity: number;
  };
  product: {
    id: number;
    name: string;
    slug: string;
    brand: string;
    image: string | null;
  };
}

export interface Cart {
  cart_id: number;
  items: CartItem[];
  subtotal: number;
  item_count: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'staff' | 'customer';
  addresses?: Address[];
  orders?: Order[];
}

export interface Address {
  id?: number;
  type: 'shipping' | 'billing';
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_variant_id: number;
  product_name: string;
  variant_sku: string;
  color?: string;
  size?: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  product?: Product;
}

export interface Shipment {
  id: number;
  order_id: number;
  tracking_number: string;
  carrier: string;
  status: string;
  estimated_delivery?: string;
  shipped_at?: string;
  delivered_at?: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id?: number | null;
  guest_email?: string | null;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'refunded';
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  tax_amount: number;
  total_amount: number;
  coupon_id?: number | null;
  shipping_address: Address;
  billing_address?: Address;
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  tracking_number?: string;
  courier_name?: string;
  notes?: string;
  created_at: string;
  items?: OrderItem[];
  shipment?: Shipment;
}

export interface Coupon {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  value: number;
  discount_amount: number;
}

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  image_path: string;
  button_text: string;
  button_url: string;
  position: number;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
  };
}
