import { RestaurantTable, MenuItem, Order, User } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Vikram Sharma (Manager)',
    email: 'admin@restaurant.com',
    password: 'password123',
    role: 'admin',
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'usr-2',
    name: 'Ananya Roy (Staff)',
    email: 'staff@restaurant.com',
    password: 'password123',
    role: 'staff',
    createdAt: '2026-02-01T10:00:00Z',
  }
];

export const INITIAL_TABLES: RestaurantTable[] = [
  { id: 'tbl-1', tableNumber: 1, capacity: 2, status: 'Available' },
  { id: 'tbl-2', tableNumber: 2, capacity: 4, status: 'Occupied', currentOrderId: 'ORD-1042' },
  { id: 'tbl-3', tableNumber: 3, capacity: 2, status: 'Available' },
  { id: 'tbl-4', tableNumber: 4, capacity: 6, status: 'Available' },
  { id: 'tbl-5', tableNumber: 5, capacity: 4, status: 'Occupied', currentOrderId: 'ORD-1044' },
  { id: 'tbl-6', tableNumber: 6, capacity: 8, status: 'Reserved' },
  { id: 'tbl-7', tableNumber: 7, capacity: 4, status: 'Available' },
  { id: 'tbl-8', tableNumber: 8, capacity: 2, status: 'Available' },
  { id: 'tbl-9', tableNumber: 9, capacity: 6, status: 'Occupied', currentOrderId: 'ORD-1045' },
  { id: 'tbl-10', tableNumber: 10, capacity: 4, status: 'Available' },
  { id: 'tbl-11', tableNumber: 11, capacity: 2, status: 'Reserved' },
  { id: 'tbl-12', tableNumber: 12, capacity: 4, status: 'Available' },
  { id: 'tbl-13', tableNumber: 13, capacity: 6, status: 'Available' },
  { id: 'tbl-14', tableNumber: 14, capacity: 2, status: 'Available' },
  { id: 'tbl-15', tableNumber: 15, capacity: 4, status: 'Available' },
  { id: 'tbl-16', tableNumber: 16, capacity: 8, status: 'Available' },
  { id: 'tbl-17', tableNumber: 17, capacity: 4, status: 'Available' },
  { id: 'tbl-18', tableNumber: 18, capacity: 2, status: 'Available' },
  { id: 'tbl-19', tableNumber: 19, capacity: 4, status: 'Available' },
  { id: 'tbl-20', tableNumber: 20, capacity: 6, status: 'Available' },
];

export const INITIAL_MENU: MenuItem[] = [
  // Fast Food & Italian
  {
    id: 'item-1',
    name: 'Pizza',
    category: 'Fast Food',
    price: 250,
    description: 'Freshly baked thin-crust pizza loaded with mozzarella cheese and farm veggies.',
    isAvailable: true,
    prepTimeMinutes: 18,
  },
  {
    id: 'item-2',
    name: 'Burger',
    category: 'Fast Food',
    price: 150,
    description: 'Crispy herb patty layered with fresh lettuce, cheddar cheese and signature mayo.',
    isAvailable: true,
    prepTimeMinutes: 12,
  },
  {
    id: 'item-3',
    name: 'Pasta',
    category: 'Fast Food',
    price: 200,
    description: 'Penne pasta tossed in rich, creamy white Alfredo sauce with mushrooms and herbs.',
    isAvailable: true,
    prepTimeMinutes: 15,
  },
  {
    id: 'item-4',
    name: 'Coffee',
    category: 'Beverages',
    price: 100,
    description: 'Aromatic roasted Arabica espresso brewed with steamed creamy milk foam.',
    isAvailable: true,
    prepTimeMinutes: 5,
  },
  // Starters
  {
    id: 'item-5',
    name: 'Garlic Bread with Cheese',
    category: 'Starters',
    price: 130,
    description: 'Toasted French baguette infused with garlic butter, melted mozzarella and oregano.',
    isAvailable: true,
    prepTimeMinutes: 10,
  },
  {
    id: 'item-6',
    name: 'Paneer Tikka',
    category: 'Starters',
    price: 220,
    description: 'Marinated cottage cheese cubes grilled in tandoor with bell peppers and onions.',
    isAvailable: true,
    prepTimeMinutes: 20,
  },
  {
    id: 'item-7',
    name: 'Crispy French Fries',
    category: 'Starters',
    price: 110,
    description: 'Golden salted potato fries served with zesty peri-peri seasoning and dip.',
    isAvailable: true,
    prepTimeMinutes: 8,
  },
  // Main Course
  {
    id: 'item-8',
    name: 'Paneer Butter Masala',
    category: 'Main Course',
    price: 260,
    description: 'Tender paneer cubes simmered in a luscious tomato, butter and cashew gravy.',
    isAvailable: true,
    prepTimeMinutes: 20,
  },
  {
    id: 'item-9',
    name: 'Veg Dum Biryani',
    category: 'Main Course',
    price: 240,
    description: 'Fragrant basmati rice slow-cooked with fresh garden vegetables and exotic spices.',
    isAvailable: true,
    prepTimeMinutes: 22,
  },
  {
    id: 'item-10',
    name: 'Dal Makhani with Naan',
    category: 'Main Course',
    price: 220,
    description: 'Overnight slow-cooked black lentils finished with cream, butter and 2 butter naans.',
    isAvailable: true,
    prepTimeMinutes: 15,
  },
  // Beverages
  {
    id: 'item-11',
    name: 'Fresh Mint Mojito',
    category: 'Beverages',
    price: 120,
    description: 'Refreshing blend of crushed mint leaves, fresh lime juice and sparkling soda.',
    isAvailable: true,
    prepTimeMinutes: 5,
  },
  {
    id: 'item-12',
    name: 'Iced Peach Tea',
    category: 'Beverages',
    price: 110,
    description: 'Chilled steeped black tea infused with sweet peach puree and lemon slice.',
    isAvailable: true,
    prepTimeMinutes: 4,
  },
  // Desserts
  {
    id: 'item-13',
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    price: 160,
    description: 'Warm chocolate cake with a molten chocolate center, served with vanilla ice cream.',
    isAvailable: true,
    prepTimeMinutes: 12,
  },
  {
    id: 'item-14',
    name: 'Gulab Jamun with Ice Cream',
    category: 'Desserts',
    price: 120,
    description: 'Two warm, soft milk dumplings soaked in cardamom sugar syrup with ice cream.',
    isAvailable: true,
    prepTimeMinutes: 5,
  }
];

// Helper to generate realistic historical orders for today that sum to ₹18,500 across 45 orders
export const generateInitialOrders = (): Order[] => {
  const baseDate = new Date();
  const dateStr = baseDate.toISOString().split('T')[0];

  // We will build a list of 45 orders
  // 3 currently active orders (on tables 2, 5, 9)
  // 42 completed & paid orders from earlier today
  const activeOrders: Order[] = [
    {
      id: 'ORD-1045',
      tableNumber: 9,
      items: [
        { menuItemId: 'item-1', name: 'Pizza', price: 250, quantity: 2 },
        { menuItemId: 'item-4', name: 'Coffee', price: 100, quantity: 2 },
        { menuItemId: 'item-5', name: 'Garlic Bread with Cheese', price: 130, quantity: 1 },
      ],
      subtotal: 830,
      tax: 83,
      total: 913,
      status: 'Served',
      createdAt: `${dateStr}T13:40:00Z`,
      customerName: 'Rohit K.',
    },
    {
      id: 'ORD-1044',
      tableNumber: 5,
      items: [
        { menuItemId: 'item-2', name: 'Burger', price: 150, quantity: 2 },
        { menuItemId: 'item-7', name: 'Crispy French Fries', price: 110, quantity: 1 },
        { menuItemId: 'item-11', name: 'Fresh Mint Mojito', price: 120, quantity: 2 },
      ],
      subtotal: 650,
      tax: 65,
      total: 715,
      status: 'Preparing',
      createdAt: `${dateStr}T13:25:00Z`,
      customerName: 'Priya S.',
    },
    {
      id: 'ORD-1042',
      tableNumber: 2,
      items: [
        { menuItemId: 'item-3', name: 'Pasta', price: 200, quantity: 1 },
        { menuItemId: 'item-4', name: 'Coffee', price: 100, quantity: 1 },
      ],
      subtotal: 300,
      tax: 30,
      total: 330,
      status: 'Billed',
      createdAt: `${dateStr}T13:10:00Z`,
      customerName: 'Amit Verma',
    },
  ];

  // Let's create completed orders such that total paid revenue today equals ₹18,500
  // Active orders total = 913 + 715 + 330 = 1,958
  // Total target revenue for completed orders = 18,500
  // 42 completed orders summing to 18,500
  const sampleCompletedItemsPool = [
    [{ menuItemId: 'item-1', name: 'Pizza', price: 250, quantity: 1 }, { menuItemId: 'item-4', name: 'Coffee', price: 100, quantity: 1 }], // sub: 350, tax: 35, tot: 385
    [{ menuItemId: 'item-2', name: 'Burger', price: 150, quantity: 2 }, { menuItemId: 'item-7', name: 'Crispy French Fries', price: 110, quantity: 1 }], // sub: 410, tax: 41, tot: 451
    [{ menuItemId: 'item-8', name: 'Paneer Butter Masala', price: 260, quantity: 1 }, { menuItemId: 'item-10', name: 'Dal Makhani with Naan', price: 220, quantity: 1 }], // sub: 480, tax: 48, tot: 528
    [{ menuItemId: 'item-9', name: 'Veg Dum Biryani', price: 240, quantity: 1 }, { menuItemId: 'item-11', name: 'Fresh Mint Mojito', price: 120, quantity: 1 }], // sub: 360, tax: 36, tot: 396
    [{ menuItemId: 'item-3', name: 'Pasta', price: 200, quantity: 2 }, { menuItemId: 'item-13', name: 'Chocolate Lava Cake', price: 160, quantity: 1 }], // sub: 560, tax: 56, tot: 616
    [{ menuItemId: 'item-6', name: 'Paneer Tikka', price: 220, quantity: 1 }, { menuItemId: 'item-1', name: 'Pizza', price: 250, quantity: 1 }], // sub: 470, tax: 47, tot: 517
  ];

  const paymentMethods: ('Cash' | 'UPI' | 'Card')[] = ['UPI', 'Card', 'Cash', 'UPI', 'UPI', 'Card'];
  const completedOrders: Order[] = [];

  let currentSum = 0;
  for (let i = 1; i <= 42; i++) {
    const padNum = String(1000 + i);
    const poolIndex = (i - 1) % sampleCompletedItemsPool.length;
    const items = sampleCompletedItemsPool[poolIndex];
    const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + tax;
    currentSum += total;

    const hour = 10 + Math.floor(i / 14);
    const minute = (i * 7) % 60;
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00Z`;

    completedOrders.push({
      id: `ORD-${padNum}`,
      tableNumber: ((i * 3) % 20) + 1,
      items,
      subtotal,
      tax,
      total,
      status: 'Paid',
      createdAt: `${dateStr}T${timeStr}`,
      paymentMethod: paymentMethods[i % paymentMethods.length],
      paymentTime: `${dateStr}T${timeStr}`,
      customerName: `Guest ${i}`,
    });
  }

  // Adjust last completed order total so the exact paid revenue hits 18,500
  const diff = 18500 - currentSum;
  if (completedOrders.length > 0) {
    const last = completedOrders[completedOrders.length - 1];
    last.total += diff;
    last.subtotal = Math.round(last.total / 1.1);
    last.tax = last.total - last.subtotal;
  }

  // Return exactly 45 orders (42 paid + 3 active)
  return [...completedOrders, ...activeOrders];
};
