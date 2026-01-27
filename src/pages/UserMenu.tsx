import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES, Category } from '../types';
import { cn } from '../utils/helpers';
import { Filter, Search } from 'lucide-react';

export const UserMenu = () => {
  const { products } = useApp();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-24 bg-brand-offWhite">
      {/* Search Section */}
      <div className="bg-brand-cream/50 pt-6 pb-2 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-brand-maroon" size={24} />
            </div>
            <input 
              type="text"
              placeholder="Search dishes..."
              className="w-full pl-14 pr-6 py-4 rounded-full bg-white border-none shadow-sm text-lg text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category Filter Section */}
      <div className="sticky top-[80px] z-40 py-6 px-4 bg-brand-offWhite/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-brand-maroon px-1">
            <Filter size={20} fill="currentColor" className="text-brand-maroon" />
            <span className="text-xl font-serif font-bold">Filter by Category</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300",
                  activeCategory === cat 
                    ? "bg-brand-maroon text-white shadow-md" 
                    : "bg-brand-cream text-brand-maroon hover:bg-brand-goldGlow"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
             <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔍</div>
             <h3 className="text-xl font-bold text-gray-600">No dishes found</h3>
             <p className="text-gray-400">Try searching for something else</p>
          </div>
        )}
      </div>
    </div>
  );
};
