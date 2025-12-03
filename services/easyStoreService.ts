import { EasyStoreConfig, Product, Order, Customer, Shop } from "../types";

// Helper to simulate network delay for mock mode
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data for Demo Mode
const MOCK_PRODUCTS: Product[] = [
  {
    id: 101,
    title: "Minimalist Leather Backpack",
    handle: "minimalist-leather-backpack",
    body_html: "<p>Handcrafted from premium genuine leather.</p>",
    vendor: "Urban Carry",
    product_type: "Bags",
    created_at: "2023-10-15T10:00:00Z",
    updated_at: "2023-11-01T12:00:00Z",
    published_at: "2023-10-15T10:00:00Z",
    tags: "leather, bag, travel",
    variants: [{ id: 1001, product_id: 101, title: "Black", price: "129.99", sku: "BP-BLK-001", inventory_quantity: 15 }],
    images: [{ id: 501, product_id: 101, src: "https://picsum.photos/400/400?random=1" }]
  },
  {
    id: 102,
    title: "Wireless Noise Cancelling Headphones",
    handle: "wireless-nc-headphones",
    body_html: "<p>Experience silence with our advanced ANC technology.</p>",
    vendor: "AudioTech",
    product_type: "Electronics",
    created_at: "2023-10-20T09:30:00Z",
    updated_at: "2023-11-05T14:20:00Z",
    published_at: "2023-10-20T09:30:00Z",
    tags: "audio, wireless, bluetooth",
    variants: [{ id: 1002, product_id: 102, title: "Silver", price: "249.00", sku: "HP-SLV-002", inventory_quantity: 8 }],
    images: [{ id: 502, product_id: 102, src: "https://picsum.photos/400/400?random=2" }]
  },
  {
    id: 103,
    title: "Organic Cotton T-Shirt",
    handle: "organic-cotton-tshirt",
    body_html: "<p>Soft, sustainable, and stylish.</p>",
    vendor: "EcoWear",
    product_type: "Apparel",
    created_at: "2023-09-01T08:00:00Z",
    updated_at: "2023-10-12T11:00:00Z",
    published_at: "2023-09-01T08:00:00Z",
    tags: "clothing, eco, cotton",
    variants: [{ id: 1003, product_id: 103, title: "L / White", price: "29.50", sku: "TS-WHT-L", inventory_quantity: 45 }],
    images: [{ id: 503, product_id: 103, src: "https://picsum.photos/400/400?random=3" }]
  }
];

const MOCK_ORDERS: Order[] = [
  {
    id: 201,
    order_number: "#1001",
    email: "customer@example.com",
    created_at: "2023-11-10T14:30:00Z",
    currency: "USD",
    total_price: "129.99",
    subtotal_price: "120.00",
    financial_status: 'paid',
    fulfillment_status: 'fulfilled',
    customer: { first_name: "John", last_name: "Doe", email: "john@example.com" }
  },
  {
    id: 202,
    order_number: "#1002",
    email: "jane@test.com",
    created_at: "2023-11-11T09:15:00Z",
    currency: "USD",
    total_price: "249.00",
    subtotal_price: "240.00",
    financial_status: 'paid',
    fulfillment_status: null,
    customer: { first_name: "Jane", last_name: "Smith", email: "jane@test.com" }
  },
  {
    id: 203,
    order_number: "#1003",
    email: "bob@builder.com",
    created_at: "2023-11-12T16:45:00Z",
    currency: "USD",
    total_price: "59.00",
    subtotal_price: "50.00",
    financial_status: 'pending',
    fulfillment_status: null,
    customer: { first_name: "Bob", last_name: "Jones", email: "bob@builder.com" }
  }
];

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 301,
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    orders_count: 5,
    total_spent: "540.00",
    currency: "USD",
    created_at: "2023-01-15T10:00:00Z"
  },
  {
    id: 302,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@test.com",
    orders_count: 12,
    total_spent: "1250.00",
    currency: "USD",
    created_at: "2023-02-20T14:00:00Z"
  },
  {
    id: 303,
    first_name: "Alice",
    last_name: "Wonder",
    email: "alice@wonder.com",
    orders_count: 1,
    total_spent: "45.00",
    currency: "USD",
    created_at: "2023-11-01T09:00:00Z"
  }
];

export class EasyStoreService {
  private config: EasyStoreConfig | null = null;
  private useMock: boolean = true;

  constructor(config?: EasyStoreConfig) {
    if (config) {
      this.config = config;
      this.useMock = false; 
    }
  }

  setMockMode(enabled: boolean) {
    this.useMock = enabled;
  }

  private getBaseUrl(): string {
    if (!this.config?.shopUrl) return '';
    let url = this.config.shopUrl;
    // Remove trailing slash if present
    if (url.endsWith('/')) url = url.slice(0, -1);
    // Ensure protocol is present
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    return url;
  }

  private getHeaders(): HeadersInit {
    return {
      'EasyStore-Access-Token': this.config?.accessToken || '',
      'Content-Type': 'application/json'
    };
  }

  /**
   * Generic fetch wrapper for EasyStore API
   */
  private async fetchResource(endpoint: string) {
    const baseUrl = this.getBaseUrl();
    const url = `${baseUrl}${endpoint}`;
    
    console.log(`Fetching: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`EasyStore API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async validateConnection(): Promise<boolean> {
    if (this.useMock) return true;
    try {
      // Validate by fetching shop info
      const data = await this.fetchResource('/api/1.0/shop');
      console.log("Connected to shop:", data.shop?.name);
      return true; 
    } catch (e) {
      console.error("Connection validation failed:", e);
      return false;
    }
  }

  async getShopInfo(): Promise<Shop | null> {
    if (this.useMock) return { 
      id: 1, name: "Demo Store", domain: "demo.easystore.co", 
      email: "demo@example.com", currency: "USD", timezone: "UTC" 
    };

    try {
      const data = await this.fetchResource('/api/1.0/shop');
      return data.shop;
    } catch (e) {
      console.error("Failed to fetch shop info", e);
      return null;
    }
  }

  async getProducts(): Promise<Product[]> {
    if (this.useMock) {
      await delay(500);
      return MOCK_PRODUCTS;
    }
    
    try {
      // Limit 250 is standard max for many e-com APIs
      const data = await this.fetchResource('/api/1.0/products?limit=250');
      return data.products || [];
    } catch (e) {
      console.error("Failed to fetch products", e);
      throw e;
    }
  }

  async getOrders(): Promise<Order[]> {
    if (this.useMock) {
      await delay(500);
      return MOCK_ORDERS;
    }

    try {
      // Fetching recent orders
      const data = await this.fetchResource('/api/1.0/orders?limit=50&financial_status=paid');
      return data.orders || [];
    } catch (e) {
      console.error("Failed to fetch orders", e);
      throw e;
    }
  }

  async getCustomers(): Promise<Customer[]> {
    if (this.useMock) {
      await delay(500);
      return MOCK_CUSTOMERS;
    }

    try {
      const data = await this.fetchResource('/api/1.0/customers?limit=50');
      return data.customers || [];
    } catch (e) {
      console.error("Failed to fetch customers", e);
      throw e;
    }
  }
}