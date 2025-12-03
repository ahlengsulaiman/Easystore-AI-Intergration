export interface EasyStoreConfig {
  shopUrl: string;
  accessToken: string;
}

export interface Product {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  variants: ProductVariant[];
  images: ProductImage[];
  tags: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  inventory_quantity: number;
}

export interface ProductImage {
  id: number;
  product_id: number;
  src: string;
}

export interface Order {
  id: number;
  order_number: string;
  email: string;
  created_at: string;
  currency: string;
  total_price: string;
  subtotal_price: string;
  financial_status: 'paid' | 'pending' | 'refunded';
  fulfillment_status: 'fulfilled' | 'partial' | null;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  orders_count: number;
  total_spent: string;
  currency: string;
  created_at: string;
}

export interface Shop {
  id: number;
  name: string;
  domain: string;
  email: string;
  currency: string;
  timezone: string;
}

export type ViewState = 'dashboard' | 'products' | 'settings' | 'ai-chat';

export interface AIAnalysisResult {
  summary: string;
  recommendations: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}