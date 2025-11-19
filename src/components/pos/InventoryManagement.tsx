"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  AlertTriangle,
  Calendar,
  TrendingDown,
  Search,
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  barcode: string;
  category: "prescription" | "otc" | "supplement" | "medical-device";
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
  onProductSelect?: (product: {
    id: string;
    name: string;
    barcode: string;
    price: number;
    type: "prescription" | "otc";
    manufacturer: string;
    stock: number;
    expiryDate: string;
    batchNumber: string;
  }) => void;
}

// --- Helper functions (defined BEFORE use) ---

function isExpiringSoon(expiryDate: string): boolean {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffInDays =
    (expiry.getTime() - today.getTime()) / (1000 * 3600 * 24);
  return diffInDays <= 90; // Expires within 90 days
}

function isLowStock(item: InventoryItem): boolean {
  return item.currentStock <= item.minStock;
}

function getStockStatus(item: InventoryItem): "low" | "high" | "normal" {
  if (item.currentStock <= item.minStock) return "low";
  if (item.currentStock >= item.maxStock) return "high";
  return "normal";
}

function getCategoryColor(category: InventoryItem["category"]): string {
  switch (category) {
    case "prescription":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "otc":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "supplement":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "medical-device":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({
  onProductSelect,
}) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [showLowStock, setShowLowStock] = useState(false);
  const [showExpiringSoon, setShowExpiringSoon] = useState(false);

  // Mock inventory data
  useEffect(() => {
    const mockInventory: InventoryItem[] = [
      {
        id: "1",
        name: "Paracetamol 500mg",
        barcode: "1234567890123",
        category: "otc",
        currentStock: 150,
        minStock: 50,
        maxStock: 500,
        unitCost: 8.5,
        sellingPrice: 12.5,
        supplier: "PharmaCorp Ltd",
        expiryDate: "2025-08-15",
        batchNumber: "PC240815",
        location: "A1-01",
        lastRestocked: "2024-11-01",
      },
      {
        id: "2",
        name: "Amoxicillin 250mg",
        barcode: "2345678901234",
        category: "prescription",
        currentStock: 25,
        minStock: 30,
        maxStock: 200,
        unitCost: 18.0,
        sellingPrice: 25.0,
        supplier: "MediLabs Inc",
        expiryDate: "2025-03-20",
        batchNumber: "ML250320",
        location: "B2-15",
        lastRestocked: "2024-10-15",
      },
      {
        id: "3",
        name: "Vitamin C 1000mg",
        barcode: "3456789012345",
        category: "supplement",
        currentStock: 200,
        minStock: 75,
        maxStock: 300,
        unitCost: 12.25,
        sellingPrice: 18.75,
        supplier: "HealthPlus",
        expiryDate: "2026-01-10",
        batchNumber: "HP010126",
        location: "C3-08",
        lastRestocked: "2024-11-10",
      },
      {
        id: "4",
        name: "Digital Thermometer",
        barcode: "4567890123456",
        category: "medical-device",
        currentStock: 15,
        minStock: 10,
        maxStock: 50,
        unitCost: 45.0,
        sellingPrice: 89.99,
        supplier: "MedTech Solutions",
        expiryDate: "2027-12-31",
        batchNumber: "MT123456",
        location: "D1-03",
        lastRestocked: "2024-09-20",
      },
      {
        id: "5",
        name: "Cough Syrup 200ml",
        barcode: "5678901234567",
        category: "otc",
        currentStock: 8,
        minStock: 20,
        maxStock: 100,
        unitCost: 9.8,
        sellingPrice: 15.3,
        supplier: "ColdRelief Pharma",
        expiryDate: "2024-12-15",
        batchNumber: "CR151224",
        location: "A2-12",
        lastRestocked: "2024-08-30",
      },
    ];
    setInventory(mockInventory);
  }, []);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode.includes(searchTerm) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;

    const matchesLowStock = !showLowStock || isLowStock(item);

    const matchesExpiring =
      !showExpiringSoon || isExpiringSoon(item.expiryDate);

    return matchesSearch && matchesCategory && matchesLowStock && matchesExpiring;
  });

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "stock":
        return a.currentStock - b.currentStock;
      case "expiry":
        return (
          new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
        );
      case "category":
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const lowStockCount = inventory.filter((item) => isLowStock(item)).length;
  const expiringSoonCount = inventory.filter((item) =>
    isExpiringSoon(item.expiryDate)
  ).length;

  const totalValue = inventory.reduce(
    (sum, item) => sum + item.currentStock * item.unitCost,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Package className="text-blue-600 dark:text-blue-400" size={24} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total Items
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {inventory.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <AlertTriangle
              className="text-red-600 dark:text-red-400"
              size={24}
            />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Low Stock
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {lowStockCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Calendar
              className="text-yellow-600 dark:text-yellow-400"
              size={24}
            />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Expiring Soon
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {expiringSoonCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <TrendingDown
              className="text-green-600 dark:text-green-400"
              size={24}
            />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Total Value
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${totalValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="prescription">Prescription</option>
              <option value="otc">OTC</option>
              <option value="supplement">Supplements</option>
              <option value="medical-device">Medical Devices</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="name">Sort by Name</option>
              <option value="stock">Sort by Stock</option>
              <option value="expiry">Sort by Expiry</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowLowStock((prev) => !prev)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showLowStock
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setShowExpiringSoon((prev) => !prev)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showExpiringSoon
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Expiring
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Expiry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {sortedInventory.map((item) => {
                const stockStatus = getStockStatus(item);
                const expiringSoon = isExpiringSoon(item.expiryDate);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCategoryColor(
                              item.category
                            )}`}
                          >
                            {item.category.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {item.barcode}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {item.supplier} • Batch: {item.batchNumber}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <div
                          className={`font-medium ${
                            stockStatus === "low"
                              ? "text-red-600 dark:text-red-400"
                              : stockStatus === "high"
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {item.currentStock} units
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Min: {item.minStock} • Max: {item.maxStock}
                        </div>
                        {stockStatus === "low" && (
                          <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                            ⚠️ Low Stock Alert
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-green-600 dark:text-green-400">
                          ${item.sellingPrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Cost: ${item.unitCost.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Margin:{" "}
                          {(
                            ((item.sellingPrice - item.unitCost) /
                              item.unitCost) *
                            100
                          ).toFixed(0)}
                          %
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div
                        className={
                          expiringSoon
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-gray-900 dark:text-white"
                        }
                      >
                        {new Date(item.expiryDate).toLocaleDateString()}
                        {expiringSoon && (
                          <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                            ⚠️ Expires Soon
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {item.location}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {onProductSelect && (
                          <button
                            onClick={() =>
                              onProductSelect({
                                id: item.id,
                                name: item.name,
                                barcode: item.barcode,
                                price: item.sellingPrice,
                                type:
                                  item.category === "prescription"
                                    ? "prescription"
                                    : "otc",
                                manufacturer: item.supplier,
                                stock: item.currentStock,
                                expiryDate: item.expiryDate,
                                batchNumber: item.batchNumber,
                              })
                            }
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                          >
                            Add to Cart
                          </button>
                        )}
                        <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded transition-colors">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedInventory.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No items found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
