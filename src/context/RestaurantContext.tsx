import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  RestaurantTable,
  MenuItem,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  AppView,
  ToastMessage,
  TableStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_TABLES,
  INITIAL_MENU,
  generateInitialOrders
} from '../data/initialData';

interface CartState {
  tableNumber: number | null;
  items: OrderItem[];
  orderId?: string; // If editing an existing order
}

interface RestaurantContextType {
  // Auth
  currentUser: User | null;
  authError: string | null;
  setAuthError: (error: string | null) => void;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;

  // View Navigation
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  navigateTo: (view: AppView) => void;

  // Tables
  tables: RestaurantTable[];
  addTable: (data: { tableNumber: number; capacity: number; status: TableStatus }) => boolean;
  updateTable: (id: string, updates: Partial<RestaurantTable>) => void;
  deleteTable: (id: string) => void;
  updateTableStatus: (tableNumber: number, status: TableStatus) => void;

  // Menu
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;

  // Orders
  orders: Order[];
  createOrder: (tableNumber: number, items: OrderItem[], customerName?: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Cart
  cart: CartState;
  addToCart: (menuItem: MenuItem, quantity?: number) => void;
  removeFromCart: (menuItemId: string) => void;
  updateCartQty: (menuItemId: string, delta: number) => void;
  setCartTableNumber: (tableNumber: number | null) => void;
  clearCart: () => void;
  submitCartToOrder: () => Order | null;

  // Billing & Payment Flow
  billingOrder: Order | null;
  setBillingOrder: (order: Order | null) => void;
  startBillingForOrder: (order: Order) => void;
  processPayment: (orderId: string, method: PaymentMethod) => boolean;
  latestPaidOrder: Order | null;

  // Stats
  metrics: {
    totalTables: number;
    todayOrdersCount: number;
    todayRevenue: number;
    availableTablesCount: number;
    occupiedTablesCount: number;
    reservedTablesCount: number;
  };

  // Utilities
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', title?: string) => void;
  removeToast: (id: string) => void;
  resetToDemoDefaults: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'rms_demo_users_v1',
  CURRENT_USER: 'rms_current_user_v1',
  TABLES: 'rms_demo_tables_v1',
  MENU: 'rms_demo_menu_v1',
  ORDERS: 'rms_demo_orders_v1',
  CART: 'rms_demo_cart_v1',
  ACTIVE_VIEW: 'rms_active_view_v1',
  BILLING_ORDER_ID: 'rms_billing_order_id_v1',
  LAST_PAID_ORDER_ID: 'rms_last_paid_order_id_v1',
};

export const RestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Users & Auth State
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USERS[0];
      }
    }
    return INITIAL_USERS[0]; // Pre-logged in for easy demo experience
  });

  const [authError, setAuthError] = useState<string | null>(null);

  // 2. Navigation State
  const [activeView, setActiveView] = useState<AppView>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_VIEW) as AppView;
    return saved || 'dashboard';
  });

  // 3. Tables State
  const [tables, setTables] = useState<RestaurantTable[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TABLES);
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  });

  // 4. Menu Items State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MENU);
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  // 5. Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : generateInitialOrders();
  });

  // 6. Cart State
  const [cart, setCart] = useState<CartState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : { tableNumber: 1, items: [] };
  });

  // 7. Billing & Payment Workflow State
  const [billingOrderId, setBillingOrderId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.BILLING_ORDER_ID) || null;
  });

  const [latestPaidOrderId, setLatestPaidOrderId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.LAST_PAID_ORDER_ID) || null;
  });

  // 8. Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_VIEW, activeView);
  }, [activeView]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (billingOrderId) {
      localStorage.setItem(STORAGE_KEYS.BILLING_ORDER_ID, billingOrderId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.BILLING_ORDER_ID);
    }
  }, [billingOrderId]);

  useEffect(() => {
    if (latestPaidOrderId) {
      localStorage.setItem(STORAGE_KEYS.LAST_PAID_ORDER_ID, latestPaidOrderId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.LAST_PAID_ORDER_ID);
    }
  }, [latestPaidOrderId]);

  // Toast Helper
  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', title?: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type, title }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateTo = (view: AppView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Handlers
  const login = (email: string, password: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(
      (u) => (u.email.toLowerCase() === cleanEmail || u.name.toLowerCase() === cleanEmail) && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      setAuthError(null);
      addToast(`Welcome back, ${user.name}!`, 'success', 'Logged In');
      navigateTo('dashboard');
      return true;
    } else {
      // Exactly required by prompt: "Invalid username or password. Please check your details and try again."
      setAuthError('Invalid username or password. Please check your details and try again.');
      return false;
    }
  };

  const register = (name: string, email: string, password: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!name.trim() || !cleanEmail || !password) {
      return { success: false, error: 'All fields are required.' };
    }

    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: password,
      role: 'staff',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    addToast('Account created successfully! Please sign in.', 'success', 'Registration Complete');
    navigateTo('login');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('You have been logged out.', 'info', 'Session Ended');
    navigateTo('login');
  };

  // Table Management Handlers
  const addTable = (data: { tableNumber: number; capacity: number; status: TableStatus }): boolean => {
    const exists = tables.some((t) => t.tableNumber === data.tableNumber);
    if (exists) {
      addToast(`Table ${data.tableNumber} already exists!`, 'error');
      return false;
    }

    const newTable: RestaurantTable = {
      id: `tbl-${Date.now()}`,
      tableNumber: data.tableNumber,
      capacity: data.capacity,
      status: data.status,
    };

    setTables((prev) => [...prev, newTable].sort((a, b) => a.tableNumber - b.tableNumber));
    addToast(`Table ${data.tableNumber} created successfully.`, 'success');
    return true;
  };

  const updateTable = (id: string, updates: Partial<RestaurantTable>) => {
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    addToast('Table updated successfully.', 'success');
  };

  const deleteTable = (id: string) => {
    const target = tables.find((t) => t.id === id);
    if (target && target.status === 'Occupied') {
      addToast(`Cannot delete Table ${target.tableNumber} while it is occupied.`, 'error');
      return;
    }
    setTables((prev) => prev.filter((t) => t.id !== id));
    addToast(`Table ${target?.tableNumber || ''} deleted.`, 'info');
  };

  const updateTableStatus = (tableNumber: number, status: TableStatus) => {
    setTables((prev) =>
      prev.map((t) => (t.tableNumber === tableNumber ? { ...t, status } : t))
    );
  };

  // Menu Management Handlers
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    setMenuItems((prev) => [newItem, ...prev]);
    addToast(`Added "${newItem.name}" to menu.`, 'success');
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    addToast('Menu item updated.', 'success');
  };

  const deleteMenuItem = (id: string) => {
    const target = menuItems.find((m) => m.id === id);
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
    addToast(`Removed "${target?.name || 'Item'}" from menu.`, 'info');
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isAvailable: !m.isAvailable } : m))
    );
  };

  // Cart Handlers
  const addToCart = (menuItem: MenuItem, quantity: number = 1) => {
    if (!menuItem.isAvailable) {
      addToast(`"${menuItem.name}" is currently unavailable.`, 'warning');
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.items.findIndex((it) => it.menuItemId === menuItem.id);
      let updatedItems: OrderItem[];

      if (existingIndex > -1) {
        updatedItems = [...prev.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + quantity,
        };
      } else {
        updatedItems = [
          ...prev.items,
          {
            menuItemId: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: quantity,
          },
        ];
      }

      return {
        ...prev,
        items: updatedItems,
      };
    });

    addToast(`Added ${menuItem.name} (x${quantity}) to Order`, 'success');
  };

  const removeFromCart = (menuItemId: string) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.menuItemId !== menuItemId),
    }));
  };

  const updateCartQty = (menuItemId: string, delta: number) => {
    setCart((prev) => {
      const existing = prev.items.find((it) => it.menuItemId === menuItemId);
      if (!existing) return prev;

      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        return {
          ...prev,
          items: prev.items.filter((it) => it.menuItemId !== menuItemId),
        };
      }

      return {
        ...prev,
        items: prev.items.map((it) =>
          it.menuItemId === menuItemId ? { ...it, quantity: newQty } : it
        ),
      };
    });
  };

  const setCartTableNumber = (tableNumber: number | null) => {
    setCart((prev) => ({ ...prev, tableNumber }));
  };

  const clearCart = () => {
    setCart((prev) => ({ ...prev, items: [] }));
  };

  // Order Handlers
  const createOrder = (tableNumber: number, items: OrderItem[], customerName: string = 'Dine-In Customer'): Order => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.1); // 10% tax
    const total = subtotal + tax;

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      tableNumber,
      items,
      subtotal,
      tax,
      total,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      customerName,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update Table status to Occupied
    updateTableStatus(tableNumber, 'Occupied');
    setTables((prev) =>
      prev.map((t) => (t.tableNumber === tableNumber ? { ...t, status: 'Occupied', currentOrderId: newOrder.id } : t))
    );

    addToast(`Order ${newOrder.id} created for Table ${tableNumber}!`, 'success', 'Order Confirmed');
    return newOrder;
  };

  const submitCartToOrder = (): Order | null => {
    if (!cart.tableNumber) {
      addToast('Please select a table for the order.', 'warning');
      return null;
    }
    if (cart.items.length === 0) {
      addToast('Please add items to your order first.', 'warning');
      return null;
    }

    const newOrder = createOrder(cart.tableNumber, cart.items);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, status, updatedAt: new Date().toISOString() };
          if (status === 'Cancelled' || status === 'Paid') {
            // Free up table if needed
            updateTableStatus(ord.tableNumber, 'Available');
          }
          return updated;
        }
        return ord;
      })
    );
    addToast(`Order ${orderId} status updated to ${status}.`, 'info');
  };

  const cancelOrder = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (target) {
      updateOrderStatus(orderId, 'Cancelled');
      updateTableStatus(target.tableNumber, 'Available');
      addToast(`Order ${orderId} has been cancelled.`, 'warning');
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  // Billing and Payment
  const billingOrder = orders.find((o) => o.id === billingOrderId) || null;

  const setBillingOrder = (order: Order | null) => {
    setBillingOrderId(order ? order.id : null);
  };

  const startBillingForOrder = (order: Order) => {
    setBillingOrderId(order.id);
    if (order.status !== 'Paid' && order.status !== 'Cancelled') {
      updateOrderStatus(order.id, 'Billed');
    }
    navigateTo('billing');
  };

  const processPayment = (orderId: string, method: PaymentMethod): boolean => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) {
      addToast('Order not found!', 'error');
      return false;
    }

    const paymentTime = new Date().toISOString();

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Paid',
              paymentMethod: method,
              paymentTime,
              updatedAt: paymentTime,
            }
          : o
      )
    );

    // Free up table
    updateTableStatus(target.tableNumber, 'Available');
    setTables((prev) =>
      prev.map((t) => (t.tableNumber === target.tableNumber ? { ...t, status: 'Available', currentOrderId: undefined } : t))
    );

    setLatestPaidOrderId(orderId);
    addToast(`Payment of ₹${target.total.toLocaleString('en-IN')} received via ${method}!`, 'success', 'Payment Successful');
    navigateTo('confirmation');
    return true;
  };

  const latestPaidOrder = orders.find((o) => o.id === latestPaidOrderId) || null;

  // Metrics calculation
  const metrics = {
    totalTables: tables.length, // Expected 20
    todayOrdersCount: orders.length, // Expected 45
    todayRevenue: orders
      .filter((o) => o.status === 'Paid')
      .reduce((sum, o) => sum + o.total, 0), // Target ₹18,500
    availableTablesCount: tables.filter((t) => t.status === 'Available').length,
    occupiedTablesCount: tables.filter((t) => t.status === 'Occupied').length,
    reservedTablesCount: tables.filter((t) => t.status === 'Reserved').length,
  };

  // Reset to initial demo data
  const resetToDemoDefaults = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setTables(INITIAL_TABLES);
    setMenuItems(INITIAL_MENU);
    const freshOrders = generateInitialOrders();
    setOrders(freshOrders);
    setCart({ tableNumber: 1, items: [] });
    setBillingOrderId(null);
    setLatestPaidOrderId(null);
    setAuthError(null);
    setActiveView('dashboard');
    addToast('Demo database restored to default sample data.', 'info', 'Reset Complete');
  };

  return (
    <RestaurantContext.Provider
      value={{
        currentUser,
        authError,
        setAuthError,
        login,
        register,
        logout,
        activeView,
        setActiveView,
        navigateTo,
        tables,
        addTable,
        updateTable,
        deleteTable,
        updateTableStatus,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        getOrderById,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        setCartTableNumber,
        clearCart,
        submitCartToOrder,
        billingOrder,
        setBillingOrder,
        startBillingForOrder,
        processPayment,
        latestPaidOrder,
        metrics,
        toasts,
        addToast,
        removeToast,
        resetToDemoDefaults,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
