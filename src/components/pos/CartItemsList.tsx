"use client";

import React from 'react';
import { Plus, Minus, Trash2, AlertTriangle, Clock, Building2, Pill, Stethoscope } from 'lucide-react';
import { CartItem } from './EnhancedPOSInterface';

interface CartItemsListProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  billingType: 'pharmacy' | 'hospital';
}

const CartItemsList: React.FC<CartItemsListProps> = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem,
  billingType 
}) => {
  if (items.length === 0) {
    return null;
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prescription':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'consultation':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'procedure':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'service':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'prescription': return 'RX';
      case 'consultation': return 'CONSULT';
      case 'procedure': return 'PROC';
      case 'service': return 'SERVICE';
      default: return 'OTC';
    }
  };

  return (
    <div className="p-4 space-y-4">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {item.category === 'pharmacy' ? (
                  <Pill size={16} className="text-blue-600 dark:text-blue-400" />
                ) : (
                  <Stethoscope size={16} className="text-green-600 dark:text-green-400" />
                )}
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {item.name}
                </h3>
              </div>
              
              {item.dosage && (
                <p className="text-sm text-gray-600 dark:text-gray-300 ml-6">
                  {item.dosage}
                </p>
              )}
              
              {item.department && (
                <div className="flex items-center gap-1 ml-6 text-sm text-gray-500 dark:text-gray-400">
                  <Building2 size={12} />
                  {item.department}
                </div>
              )}
              
              {item.duration && (
                <div className="flex items-center gap-1 ml-6 text-sm text-gray-500 dark:text-gray-400">
                  <Clock size={12} />
                  {item.duration}
                </div>
              )}
              
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-6">
                {item.manufacturer || item.serviceType} • {item.barcode}
              </p>
              
              {/* Prescription Warning */}
              {item.type === 'prescription' && (
                <div className="flex items-center gap-1 mt-2 ml-6 text-xs text-red-600 dark:text-red-400">
                  <AlertTriangle size={12} />
                  Prescription Required - Verify Patient ID
                </div>
              )}
            </div>
            
            <div className="text-right">
              <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                getTypeColor(item.type)
              }`}>
                {getTypeLabel(item.type)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
              >
                <Minus size={16} />
              </button>
              
              <span className="w-12 text-center font-medium text-gray-900 dark:text-white">
                {item.quantity}
              </span>
              
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  ${item.price.toFixed(2)} each
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
              
              <button
                onClick={() => onRemoveItem(item.id)}
                className="w-8 h-8 flex items-center justify-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          {/* Additional Info for Special Items */}
          {(item.type === 'prescription' || billingType === 'hospital') && (
            <div className={`border rounded-lg p-3 ${
              item.type === 'prescription' 
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
            }`}>
              {item.type === 'prescription' ? (
                <div className="text-sm text-red-800 dark:text-red-300">
                  ⚠️ <strong>Prescription Item:</strong> Verify prescription and patient ID before dispensing.
                  {item.expiryDate && (
                    <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Expires: {item.expiryDate}
                    </div>
                  )}
                  {item.batchNumber && (
                    <div className="text-xs text-red-600 dark:text-red-400">
                      Batch: {item.batchNumber}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  📋 <strong>Medical Service:</strong> Ensure proper documentation and physician authorization.
                  {item.duration && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Duration: {item.duration}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CartItemsList;