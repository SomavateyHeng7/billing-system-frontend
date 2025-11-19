"use client";

import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Calendar, TrendingDown, Search, Filter } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  barcode: string;
  category: 'prescription' | 'otc' | 'supplement' | 'medical-device';
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  sellingPrice: number;
  supplier: string;
  expiryDate: string;
  batchNumber: string;
  location: string;
  lastRestocked: string;
}

interface InventoryManagementProps {
  onProductSelect?: (product: any) => void;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({ onProductSelect }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [showLowStock, setShowLowStock] = useState(false);
  const [showExpiringSoon, setShowExpiringSoon] = useState(false);

  // Mock inventory data
  useEffect(() => {
    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Paracetamol 500mg',
        barcode: '1234567890123',
        category: 'otc',
        currentStock: 150,
        minStock: 50,
        maxStock: 500,
        unitCost: 8.50,
        sellingPrice: 12.50,
        supplier: 'PharmaCorp Ltd',
        expiryDate: '2025-08-15',
        batchNumber: 'PC240815',
        location: 'A1-01',
        lastRestocked: '2024-11-01'
      },
      {
        id: '2',
        name: 'Amoxicillin 250mg',
        barcode: '2345678901234',
        category: 'prescription',
        currentStock: 25,
        minStock: 30,
        maxStock: 200,
        unitCost: 18.00,
        sellingPrice: 25.00,
        supplier: 'MediLabs Inc',
        expiryDate: '2025-03-20',
        batchNumber: 'ML250320',
        location: 'B2-15',
        lastRestocked: '2024-10-15'
      },
      {
        id: '3',
        name: 'Vitamin C 1000mg',
        barcode: '3456789012345',
        category: 'supplement',
        currentStock: 200,
        minStock: 75,
        maxStock: 300,
        unitCost: 12.25,
        sellingPrice: 18.75,
        supplier: 'HealthPlus',
        expiryDate: '2026-01-10',
        batchNumber: 'HP010126',
        location: 'C3-08',
        lastRestocked: '2024-11-10'
      }
    ];
    setInventory(mockInventory);
  }, []);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode.includes(searchTerm) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesLowStock = !showLowStock || item.currentStock <= item.minStock;
    const matchesExpiring = !showExpiringSoon || isExpiringSoon(item.expiryDate);
    
    return matchesSearch && matchesCategory && matchesLowStock && matchesExpiring;
  });

  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffInDays = (expiry.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return diffInDays <= 90;
  };

  const isLowStock = (item: InventoryItem) => {
    return item.currentStock <= item.minStock;
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <Package className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Items</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{inventory.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-600" size={24} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Low Stock</p>
              <p className="text-2xl font-bold text-red-600">{inventory.filter(item => isLowStock(item)).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.barcode}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`font-medium ${isLowStock(item) ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                      {item.currentStock} units
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-green-600">${item.sellingPrice.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4">
                    {onProductSelect && (
                      <button
                        onClick={() => onProductSelect({
                          id: item.id,
                          name: item.name,
                          barcode: item.barcode,
                          price: item.sellingPrice,
                          type: item.category === 'prescription' ? 'prescription' : 'otc',
                          manufacturer: item.supplier,
                          stock: item.currentStock
                        })}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                      >
                        Add to Cart
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;