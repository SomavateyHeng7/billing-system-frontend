'use client';

import { useState } from 'react';
import { CreditCardIcon, XIcon } from 'lucide-react';

interface PaymentData {
  amount: number;
  method: string;
  reference: string;
  notes: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxAmount: number;
  onPaymentSubmit: (paymentData: PaymentData & { date: string; status: string }) => void;
  title?: string;
  currency?: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  maxAmount,
  onPaymentSubmit,
  title = "Record Payment",
  currency = "$"
}: PaymentModalProps) {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: maxAmount,
    method: 'credit_card',
    reference: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const paymentMethods = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'check', label: 'Check' },
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'insurance', label: 'Insurance Payment' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentData.amount || paymentData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (paymentData.amount > maxAmount) {
      newErrors.amount = `Amount cannot exceed ${currency}${maxAmount.toFixed(2)}`;
    }
    if (!paymentData.method) {
      newErrors.method = 'Payment method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onPaymentSubmit({
      ...paymentData,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed'
    });

    // Reset form
    setPaymentData({
      amount: maxAmount,
      method: 'credit_card',
      reference: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setPaymentData({
      amount: maxAmount,
      method: 'credit_card',
      reference: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button 
            onClick={handleClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Payment Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">{currency}</span>
              <input
                type="number"
                step="0.01"
                min="0"
                max={maxAmount}
                className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.amount ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
                value={paymentData.amount}
                onChange={(e) => setPaymentData(prev => ({ 
                  ...prev, 
                  amount: parseFloat(e.target.value) || 0 
                }))}
                required
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method *
            </label>
            <select
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.method ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
              }`}
              value={paymentData.method}
              onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
              required
            >
              {paymentMethods.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
            {errors.method && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.method}</p>
            )}
          </div>

          {/* Reference Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reference Number <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Check number, Transaction ID"
              value={paymentData.reference}
              onChange={(e) => setPaymentData(prev => ({ ...prev, reference: e.target.value }))}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Payment notes or comments"
              value={paymentData.notes}
              onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <CreditCardIcon className="h-4 w-4" />
              <span>Record Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}