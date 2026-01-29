import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, UtensilsCrossed, ChefHat } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/helpers';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const { cart, tableNumber } = useApp();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [cartBounce, setCartBounce] = useState(false);
  const prevCartLength = React.useRef(cart.length);

  useEffect(() => {
    if (cart.length > prevCartLength.current) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 500);
    }
    prevCartLength.current = cart.length;
  }, [cart.length]);

  // Don't show the main navbar on Admin Dashboard as it has its own sidebar
  if (isAdmin && location.pathname.includes('dashboard')) return null;

  return (
    <nav className={cn(
      "sticky top-0 z-50 shadow-sm px-6 py-4 transition-colors bg-brand-cream"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <Link to={isAdmin ? "/admin" : "/"} className="flex items-center gap-3 group">
          <div className="bg-brand-maroon p-2.5 rounded-full text-white group-hover:bg-brand-burgundy transition-colors shadow-md">
            {isAdmin ? <ChefHat size={22} /> : <UtensilsCrossed size={22} />}
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-none text-brand-maroon font-serif">Yummy-Fi</h1>
            <p className="text-xs text-brand-maroon/70 font-sans font-medium tracking-wide">
              {isAdmin ? 'Admin Panel' : 'Restaurant System'}
            </p>
          </div>
        </Link>

        {/* Center Navigation (User Only) */}
        {!isAdmin && (
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-brand-maroon font-bold hover:text-brand-burgundy transition-colors">Menu</Link>
            <Link to="/track-order" className="text-gray-600 font-medium hover:text-brand-maroon transition-colors">Track Order</Link>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {!isAdmin && tableNumber && (
            <span className="hidden lg:block text-sm font-bold text-brand-maroon bg-white px-4 py-1.5 rounded-full shadow-sm border border-brand-maroon/10">
              Table {tableNumber}
            </span>
          )}
          
          {!isAdmin && (
            <Link to="/cart" className="relative p-2 text-gray-800 hover:text-brand-maroon transition-colors">
              <motion.div
                animate={cartBounce ? {
                  scale: [1, 1.3, 0.9, 1.1, 1],
                  rotate: [0, -10, 10, -5, 0]
                } : {}}
                transition={{ duration: 0.5 }}
              >
                <ShoppingCart size={26} strokeWidth={2} />
              </motion.div>
              {cart.length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-brand-maroon text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-brand-cream"
                >
                  {cart.length}
                </motion.span>
              )}
            </Link>
          )}

          {isAdmin && (
             <Link to="/" className="text-sm font-medium text-gray-500 hover:text-brand-maroon">Exit Admin</Link>
          )}
        </div>
      </div>
    </nav>
  );
};
