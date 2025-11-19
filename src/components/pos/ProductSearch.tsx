"use client";

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Search, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  barcode: string;
  price: number;
  type: 'prescription' | 'otc' | 'service' | 'procedure' | 'consultation';
  category: 'pharmacy' | 'hospital';
  manufacturer?: string;
  stock?: number;
  dosage?: string;
  department?: string;
  duration?: string;
}

interface ProductSearchProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  placeholder?: string;
}

const ProductSearch = forwardRef<HTMLInputElement, ProductSearchProps>((
  { products, onProductSelect, placeholder = "Search products..." }, ref
) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm) ||
    (product.manufacturer && product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleProductSelect = (product: Product) => {
    onProductSelect(product);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  return (
    <div className="relative flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onFocus={() => setShowSuggestions(searchTerm.length > 0)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
      
      {showSuggestions && searchTerm && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 max-h-60 overflow-y-auto z-10 shadow-lg">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package size={16} className="text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {product.manufacturer} • Stock: {product.stock}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600 dark:text-green-400">
                      ${product.price.toFixed(2)}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      product.type === 'prescription'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {product.type === 'prescription' ? 'RX' : 'OTC'}
                    </div>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ProductSearch.displayName = 'ProductSearch';

export default ProductSearch;