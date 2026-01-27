export interface Product {
  id: string;
  name: string;
  price: number;
  offerPrice?: number;
  description: string;
  category: string;
  imageUrl: string; // Base64 or URL
  isVeg: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  tableNumber: string;
  customerName?: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'ready' | 'completed';
  createdAt: string;
  confirmedAt?: string; // New field to track when timer starts
  readyAt?: string; // Field to track when order is marked ready
}

export type Category = 'All' | 'Main Course' | 'Rice & Biryani' | 'Starters' | 'Breads' | 'Desserts';

export const CATEGORIES: Category[] = ['All', 'Main Course', 'Rice & Biryani', 'Starters', 'Breads', 'Desserts'];
