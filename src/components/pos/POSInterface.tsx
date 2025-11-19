"use client";

import React, { useState, useRef } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Scan, CreditCard, Receipt, X } from 'lucide-react';
import ProductSearch from './ProductSearch';
import BarcodeScanner from './BarcodeScanner';
import CartItemsList from './CartItemsList';
import PaymentModal from './PaymentModal';
import ReceiptModal from './ReceiptModal';

export interface CartItem {
  id: string;
  name: string;
  barcode: string;
  price: number;
  quantity: number;
  type: 'prescription' | 'otc' | 'service' | 'procedure' | 'consultation';
  category: 'pharmacy' | 'hospital';
  dosage?: string;
  manufacturer?: string;
  expiryDate?: string;
  batchNumber?: string;
  serviceType?: string;
  department?: string;
  duration?: string;
}

export interface Receipt {
  id: string;
  date: string;
  time: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  billingType: 'pharmacy' | 'hospital';
  cashierName: string;
  pharmacistName?: string;
}

const POSInterface: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);
  const [discount, setDiscount] = useState(0);
  const [taxRate] = useState(0.08); // 8% tax rate
  const searchRef = useRef<HTMLInputElement>(null);

  // Mock product database
  const mockProducts = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      barcode: '1234567890123',
      price: 12.50,
      type: 'otc' as const,
      category: 'pharmacy' as const,
      manufacturer: 'PharmaCorp',
      stock: 150
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      barcode: '2345678901234',
      price: 25.00,
      type: 'prescription' as const,
      category: 'pharmacy' as const,
      dosage: '250mg capsules',
      manufacturer: 'MediLabs',
      stock: 80
    },
    {
      id: '3',
      name: 'Vitamin C 1000mg',
      barcode: '3456789012345',
      price: 18.75,
      type: 'otc' as const,
      category: 'pharmacy' as const,
      manufacturer: 'HealthPlus',
      stock: 200
    },
    {
      id: '4',
      name: 'Insulin Pen',
      barcode: '4567890123456',
      price: 89.99,
      type: 'prescription' as const,
      category: 'pharmacy' as const,
      dosage: '100 units/mL',
      manufacturer: 'DiabetesCare',
      stock: 25
    },
    {
      id: '5',
      name: 'Cough Syrup',
      barcode: '5678901234567',
      price: 15.30,
      type: 'otc' as const,
      category: 'pharmacy' as const,
      manufacturer: 'ColdRelief',
      stock: 95
    }
  ];

  const addToCart = (productData: any) => {
    const existingItem = cart.find(item => item.id === productData.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === productData.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: productData.id,
        name: productData.name,
        barcode: productData.barcode,
        price: productData.price,
        quantity: 1,
        type: productData.type,
        category: productData.category || 'pharmacy',
        dosage: productData.dosage,
        manufacturer: productData.manufacturer,
        expiryDate: productData.expiryDate,
        batchNumber: productData.batchNumber
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  const handleBarcodeScanned = (barcode: string) => {
    const product = mockProducts.find(p => p.barcode === barcode);
    if (product) {
      addToCart(product);
      setShowScanner(false);
    } else {
      alert('Product not found! Please add manually.');
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * taxRate;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - discount;
  };

  const handlePayment = (paymentMethod: string) => {
    const receipt: Receipt = {
      id: `RCP-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      items: [...cart],
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      discount: discount,
      total: calculateTotal(),
      paymentMethod: paymentMethod,
      billingType: 'pharmacy',
      cashierName: 'Current User', // This would come from auth
      pharmacistName: cart.some(item => item.type === 'prescription') ? 'Dr. Smith' : undefined
    };
    
    setCurrentReceipt(receipt);
    setShowPayment(false);
    setShowReceipt(true);
    clearCart();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Product Search and Scanner */}
      <div className="lg:col-span-2 space-y-6">
        {/* Search and Scanner Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <ProductSearch 
                products={mockProducts}
                onProductSelect={addToCart}
                ref={searchRef}
              />
            </div>
            <button
              onClick={() => setShowScanner(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Scan size={18} />
              Scan Barcode
            </button>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Add Products
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {mockProducts.slice(0, 8).map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="p-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <div className="font-medium text-gray-900 dark:text-white truncate">
                  {product.name}
                </div>
                <div className="text-green-600 dark:text-green-400 font-semibold">
                  ${product.price.toFixed(2)}
                </div>
                <div className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                  product.type === 'prescription' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {product.type === 'prescription' ? 'RX' : 'OTC'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shopping Cart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <ShoppingCart size={24} />
              Cart ({cart.length})
            </h2>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          <CartItemsList 
            items={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            billingType="pharmacy"
          />
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Discount:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">$</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Tax ({(taxRate * 100).toFixed(0)}%):</span>
                <span className="font-medium">${calculateTax().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-3">
                <span>Total:</span>
                <span className="text-green-600 dark:text-green-400">${calculateTotal().toFixed(2)}</span>
              </div>
              
              <button
                onClick={() => setShowPayment(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <CreditCard size={20} />
                Process Payment
              </button>
            </div>
          </div>
        )}

        {cart.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
              <p>Cart is empty</p>
              <p className="text-sm">Scan or search for products to add</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showPayment && (
        <PaymentModal
          total={calculateTotal()}
          onPayment={handlePayment}
          onClose={() => setShowPayment(false)}
        />
      )}

      {showReceipt && currentReceipt && (
        <ReceiptModal
          isOpen={showReceipt}
          receipt={currentReceipt}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default POSInterface;