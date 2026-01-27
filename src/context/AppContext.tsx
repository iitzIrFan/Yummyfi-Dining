import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockData';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  tableNumber: string | null;
  customerName: string | null;
  isAdminAuthenticated: boolean;
  toastVisible: boolean;
  toastMessage: string;
  toastProductName: string;
  setTableInfo: (num: string, name: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  placeOrder: () => string | null;
  loginAdmin: () => void;
  logoutAdmin: () => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  hideToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('yummy-products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('yummy-orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [tableNumber, setTableNumber] = useState<string | null>(localStorage.getItem('tableNumber'));
  const [customerName, setCustomerName] = useState<string | null>(localStorage.getItem('customerName'));
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastProductName, setToastProductName] = useState('');

  useEffect(() => {
    localStorage.setItem('yummy-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('yummy-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (tableNumber) localStorage.setItem('tableNumber', tableNumber);
    if (customerName) localStorage.setItem('customerName', customerName);
  }, [tableNumber, customerName]);

  const setTableInfo = (num: string, name: string) => {
    setTableNumber(num);
    setCustomerName(name);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    // Show toast notification
    setToastMessage('Added to cart!');
    setToastProductName(product.name);
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const placeOrder = () => {
    if (!tableNumber || cart.length === 0) return null;

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderId = `ORD-2026-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      tableNumber,
      customerName: customerName || 'Guest',
      items: [...cart],
      totalAmount: cart.reduce((sum, item) => sum + (item.offerPrice || item.price) * item.quantity, 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);

    localStorage.setItem('lastOrderId', orderId);

    return orderId;
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updates: Partial<Order> = { status };
        // If confirming, set the confirmedAt timestamp to start the timer
        if (status === 'confirmed' && !o.confirmedAt) {
          updates.confirmedAt = new Date().toISOString();
        }
        if (status === 'ready' && !o.readyAt) {
          updates.readyAt = new Date().toISOString();
        }
        return { ...o, ...updates };
      }
      return o;
    }));
  };

  const loginAdmin = () => setIsAdminAuthenticated(true);
  const logoutAdmin = () => setIsAdminAuthenticated(false);

  return (
    <AppContext.Provider value={{
      products, cart, orders, tableNumber, customerName, isAdminAuthenticated,
      toastVisible, toastMessage, toastProductName,
      setTableInfo, addToCart, removeFromCart, updateQuantity, placeOrder,
      loginAdmin, logoutAdmin, addProduct, deleteProduct, updateOrderStatus,
      hideToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
