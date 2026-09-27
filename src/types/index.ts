export type UserRole = 'admin' | 'manager' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: string;
}

export type TableStatus = 'Available' | 'Occupied' | 'Reserved';

export interface RestaurantTable {
  id: string;
  tableNumber: number;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  notes?: string;
}

export type MenuCategory = 'All' | 'Starters' | 'Main Course' | 'Fast Food' | 'Beverages' | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'All'>;
  price: number;
  description: string;
  isAvailable: boolean;
  image?: string;
  prepTimeMinutes?: number;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Served' | 'Billed' | 'Paid' | 'Cancelled';

export type PaymentMethod = 'Cash' | 'UPI' | 'Card';

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  subtotal: number;
  tax: number; // 10%
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  paymentMethod?: PaymentMethod;
  paymentTime?: string;
  customerName?: string;
  customerPhone?: string;
}

export type AppView = 
  | 'login'
  | 'register'
  | 'dashboard'
  | 'tables'
  | 'menu'
  | 'orders'
  | 'cart'
  | 'billing'
  | 'payment'
  | 'confirmation'
  | 'reports';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}
