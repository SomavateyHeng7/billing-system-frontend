'use client';

import { useState } from 'react';
import { TrashIcon, EditIcon } from 'lucide-react';

interface LineItem {
  id: string;
  serviceCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
}

interface LineItemsTableProps {
  lineItems: LineItem[];
  onUpdateLineItem: (id: string, field: keyof LineItem, value: string | number) => void;
  onRemoveLineItem: (id: string) => void;
  isEditable?: boolean;
  showActions?: boolean;
  error?: string;
}

export default function LineItemsTable({
  lineItems,
  onUpdateLineItem,
  onRemoveLineItem,
  isEditable = true,
  showActions = true,
  error
}: LineItemsTableProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const handleUpdateItem = (id: string, field: keyof LineItem, value: string | number) => {
    onUpdateLineItem(id, field, value);
  };

  const handleEditClick = (id: string) => {
    setEditingItem(editingItem === id ? null : id);
  };

  if (lineItems.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400 text-sm">No services added yet</p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Click "Add Service" to get started</p>
        {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Service
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Unit Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Total
              </th>
              {showActions && isEditable && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {lineItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                  {item.serviceCode}
                </td>
                <td className="px-4 py-4">
                  {isEditable && editingItem === item.id ? (
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      onBlur={() => setEditingItem(null)}
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm text-gray-900 dark:text-white">{item.description}</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  {isEditable && editingItem === item.id ? (
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      onBlur={() => setEditingItem(null)}
                    />
                  ) : (
                    <span className="text-sm text-gray-900 dark:text-white">{item.quantity}</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  {isEditable && editingItem === item.id ? (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      onBlur={() => setEditingItem(null)}
                    />
                  ) : (
                    <span className="text-sm text-gray-900 dark:text-white">${item.unitPrice.toFixed(2)}</span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  ${item.total.toFixed(2)}
                </td>
                {showActions && isEditable && (
                  <td className="px-4 py-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditClick(item.id)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        title="Edit item"
                      >
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onRemoveLineItem(item.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                        title="Remove item"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes section for editable tables */}
      {isEditable && lineItems.some(item => item.notes) && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes:</h4>
          {lineItems.filter(item => item.notes).map(item => (
            <div key={`notes-${item.id}`} className="text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">{item.serviceCode}:</span> {item.notes}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}