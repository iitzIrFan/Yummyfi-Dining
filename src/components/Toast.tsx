import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  productName: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast = ({ message, productName, isVisible, onClose }: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -100, x: '-50%' }}
          className="fixed top-24 left-1/2 z-[60] max-w-md w-full mx-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-brand-goldGlow/20 p-4 flex items-center gap-4">
            <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div className="flex-grow">
              <p className="font-bold text-brand-maroon text-sm">{message}</p>
              <p className="text-gray-600 text-xs mt-0.5">{productName}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
