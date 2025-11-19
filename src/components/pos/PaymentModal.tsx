"use client";

import React, { useState, useEffect } from 'react';
import { X, CreditCard, DollarSign, Smartphone, Building2, User, Shield } from 'lucide-react';
import { Patient } from './EnhancedPOSInterface';

interface PaymentModalProps {
  total: number;
  onPayment: (paymentMethod: string) => void;
  onClose: () => void;
  billingType?: 'pharmacy' | 'hospital';
  patient?: Patient | null;
}

type PaymentMethod = 'cash' | 'card' | 'mobile' | 'insurance';

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  total, 
  onPayment, 
  onClose, 
  billingType = 'pharmacy',
  patient 
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [cashReceived, setCashReceived] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const change = selectedMethod === 'cash' ? 
    Math.max(0, parseFloat(cashReceived || '0') - total) : 0;

  const handlePayment = async () => {
    if (selectedMethod === 'cash' && parseFloat(cashReceived || '0') < total) {
      alert('Insufficient cash received');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing with longer time for insurance
    const processingTime = selectedMethod === 'insurance' ? 3000 : 2000;
    setTimeout(() => {
      onPayment(getPaymentMethodName(selectedMethod));
      setIsProcessing(false);
    }, processingTime);
  };

  const getPaymentMethodName = (method: PaymentMethod): string => {
    switch (method) {
      case 'cash': return 'Cash';
      case 'card': return 'Credit/Debit Card';
      case 'mobile': return 'Mobile Payment';
      case 'insurance': return patient?.insuranceProvider || 'Insurance';
      default: return 'Unknown';
    }
  };

  const isPaymentValid = () => {
    if (selectedMethod === 'cash') {
      return parseFloat(cashReceived || '0') >= total;
    }
    if (selectedMethod === 'insurance' && !patient?.insuranceNumber) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isProcessing) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose, isProcessing]);

  const paymentMethods = [
    {
      id: 'cash' as PaymentMethod,
      name: 'Cash',
      icon: DollarSign,
      description: 'Pay with cash'
    },
    {
      id: 'card' as PaymentMethod,
      name: 'Card',
      icon: CreditCard,
      description: 'Credit/Debit card'
    },
    {
      id: 'mobile' as PaymentMethod,
      name: 'Mobile Pay',
      icon: Smartphone,
      description: 'Apple Pay, Google Pay, etc.'
    },
    {
      id: 'insurance' as PaymentMethod,
      name: 'Insurance',
      icon: Shield,
      description: patient?.insuranceProvider || 'Insurance coverage',
      disabled: !patient?.insuranceNumber
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Process Payment
            </h2>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>

          {/* Billing Type Badge */}
          <div className="mb-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              billingType === 'pharmacy'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}>
              {billingType === 'pharmacy' ? '💊' : '🏥'}
              {billingType === 'pharmacy' ? 'Pharmacy' : 'Hospital'} Billing
            </div>
          </div>

          {/* Patient Information */}
          {patient && (
            <div className="mb-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Patient:</span>
              </div>
              <div className="ml-6">
                <div className="font-medium text-gray-900 dark:text-white">{patient.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{patient.phone}</div>
                {patient.insuranceProvider && (
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    {patient.insuranceProvider} - {patient.insuranceNumber}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Total Amount */}
          <div className="mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                Total: ${total.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Patient responsibility after insurance
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Payment Method
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isDisabled = method.disabled || isProcessing;
                return (
                  <button
                    key={method.id}
                    onClick={() => !isDisabled && setSelectedMethod(method.id)}
                    disabled={isDisabled}
                    className={`p-4 border rounded-lg text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      selectedMethod === method.id && !isDisabled
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon 
                        size={20} 
                        className={selectedMethod === method.id && !isDisabled
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-400'
                        } 
                      />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {method.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {method.description}
                    </p>
                    {method.disabled && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        No insurance information available
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cash Payment Details */}
          {selectedMethod === 'cash' && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cash Received
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    disabled={isProcessing}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                    autoFocus
                  />
                </div>
              </div>
              
              {cashReceived && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Total:</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Cash Received:</span>
                    <span className="font-medium">${parseFloat(cashReceived || '0').toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-300 dark:border-gray-600 pt-2">
                    <span className="font-medium text-gray-900 dark:text-white">Change:</span>
                    <span className={`font-bold ${
                      change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      ${change.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Insurance Processing Notice */}
          {selectedMethod === 'insurance' && patient?.insuranceNumber && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                <Shield size={16} />
                <span className="font-medium">Insurance Processing</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-2">
                This will process the claim with {patient.insuranceProvider}. Processing may take a few moments.
              </p>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="mb-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedMethod === 'insurance' ? 'Processing insurance claim...' : 'Processing payment...'}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={!isPaymentValid() || isProcessing}
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Complete Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;