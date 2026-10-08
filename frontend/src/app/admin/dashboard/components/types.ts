import type { Banner, Category, Product } from '@/types';

export type DashboardTab = 'stats' | 'orders' | 'products' | 'create_product' | 'banners';

export interface DashboardStats {
  total_revenue?: number;
  total_orders?: number;
  pending_orders?: number;
  total_products?: number;
}

export interface DashboardOrder {
  id: number;
  order_number: string;
  user?: { name: string } | null;
  shipping_address?: { first_name?: string; email?: string };
  guest_email?: string | null;
  status: string;
  payment_method: string;
  payment_status: string;
  total_amount: number;
  tracking_number?: string;
}

export type DashboardProduct = Omit<Product, 'category' | 'variants'> & {
  category?: Pick<Category, 'name'>;
  variants?: Array<{ color: string; size: string; stock_quantity: number }>;
};

export type { Banner, Category };
