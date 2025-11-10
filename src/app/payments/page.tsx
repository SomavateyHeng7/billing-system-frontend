'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  CreditCardIcon,
  BanknoteIcon,
  DollarSignIcon,
  BuildingIcon,
  UserIcon,
  CheckIcon,
  XIcon,
  LockIcon,
  CalendarIcon,
  PrinterIcon,
  MailIcon,
  DownloadIcon,
  ClockIcon,
  AlertCircleIcon,
  ShieldCheckIcon,
  RefreshCwIcon
} from 'lucide-react';

import { Sidebar } from '../../components/layout/sidebar';
import { Header } from '../../components/shared/header';
import Footer from '../../components/shared/footer';

// Mock data for outstanding invoices
const mockOutstandingInvoices = [
  {
    id: 'INV-2024-001',
    patientName: 'John Smith',
    amount: 234.00,
    dueDate: '2024-12-01',
    description: 'Office Visit & Lab Work'
  },
  {
    id: 'INV-2024-002',
    patientName: 'Sarah Johnson',
    amount: 1085.00,
    dueDate: '2024-11-27',
    description: 'Emergency Department Visit',
    isOverdue: true
  },
  {
    id: 'INV-2024-003',
    patientName: 'Michael Brown',
    amount: 450.00,
    dueDate: '2024-12-15',
    description: 'Cardiology Consultation'
  }
];

interface PaymentFormData {
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  
  // Credit/Debit Card fields
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  
  // Check fields
  checkNumber: string;
  bankName: string;
  
  // Bank Transfer fields
  accountNumber: string;
  routingNumber: string;
  
  // Cash fields
  receivedBy: string;
  
  // Insurance fields
  insuranceProvider: string;
  authorizationNumber: string;
  
  // Common fields
  notes: string;
}

interface PaymentResult {
  success: boolean;
  transactionId: string;
  receiptNumber: string;
  timestamp: string;
  message: string;
}

export default function PaymentProcessing() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    invoiceId: '',
    amount: 0,
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    checkNumber: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    receivedBy: '',
    insuranceProvider: '',
    authorizationNumber: '',
    notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    if (selectedInvoice) {
      setPaymentData(prev => ({
        ...prev,
        invoiceId: selectedInvoice.id,
        amount: selectedInvoice.amount
      }));
    }
  }, [selectedInvoice]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedInvoice) {
      newErrors.invoice = 'Please select an invoice to pay';
    }

    if (!paymentData.amount || paymentData.amount <= 0) {
      newErrors.amount = 'Please enter a valid payment amount';
    }

    if (paymentData.amount > selectedInvoice?.amount) {
      newErrors.amount = 'Payment amount cannot exceed invoice balance';
    }

    // Payment method specific validation
    switch (paymentData.paymentMethod) {
      case 'credit_card':
      case 'debit_card':
        if (!paymentData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
          newErrors.cardNumber = 'Please enter a valid 16-digit card number';
        }
        if (!paymentData.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
          newErrors.expiryDate = 'Please enter expiry date in MM/YY format';
        }
        if (!paymentData.cvv.match(/^\d{3,4}$/)) {
          newErrors.cvv = 'Please enter a valid CVV';
        }
        if (!paymentData.cardholderName.trim()) {
          newErrors.cardholderName = 'Cardholder name is required';
        }
        break;
      case 'check':
        if (!paymentData.checkNumber.trim()) {
          newErrors.checkNumber = 'Check number is required';
        }
        if (!paymentData.bankName.trim()) {
          newErrors.bankName = 'Bank name is required';
        }
        break;
      case 'bank_transfer':
        if (!paymentData.accountNumber.trim()) {
          newErrors.accountNumber = 'Account number is required';
        }
        if (!paymentData.routingNumber.match(/^\d{9}$/)) {
          newErrors.routingNumber = 'Please enter a valid 9-digit routing number';
        }
        break;
      case 'cash':
        if (!paymentData.receivedBy.trim()) {
          newErrors.receivedBy = 'Please specify who received the payment';
        }
        break;
      case 'insurance':
        if (!paymentData.insuranceProvider.trim()) {
          newErrors.insuranceProvider = 'Insurance provider is required';
        }
        if (!paymentData.authorizationNumber.trim()) {
          newErrors.authorizationNumber = 'Authorization number is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processPayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result: PaymentResult = {
        success: true,
        transactionId: `TXN${Date.now()}`,
        receiptNumber: `RCP${Date.now()}`,
        timestamp: new Date().toISOString(),
        message: 'Payment processed successfully'
      };
      
      setPaymentResult(result);
      setShowReceipt(true);
    } catch (error) {
      setPaymentResult({
        success: false,
        transactionId: '',
        receiptNumber: '',
        timestamp: new Date().toISOString(),
        message: 'Payment processing failed. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const resetForm = () => {
    setSelectedInvoice(null);
    setPaymentData({
      invoiceId: '',
      amount: 0,
      paymentMethod: 'credit_card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      checkNumber: '',
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      receivedBy: '',
      insuranceProvider: '',
      authorizationNumber: '',
      notes: ''
    });
    setPaymentResult(null);
    setShowReceipt(false);
    setErrors({});
  };

  const printReceipt = () => {
    window.print();
  };

  const emailReceipt = () => {
    alert('Receipt emailed successfully!');
  };

  if (showReceipt && paymentResult) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckIcon className="h-8 w-8 text-green-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payment Successful</h1>
                    <p className="text-sm text-gray-600">Transaction completed successfully</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={printReceipt}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                  >
                    <PrinterIcon className="h-4 w-4" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={emailReceipt}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                  >
                    <MailIcon className="h-4 w-4" />
                    <span>Email Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Payment Receipt</h2>
              <p className="text-sm text-gray-600 mt-2">Receipt #{paymentResult.receiptNumber}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Transaction ID:</span>
                    <span className="text-sm font-medium">{paymentResult.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Date & Time:</span>
                    <span className="text-sm font-medium">
                      {new Date(paymentResult.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Payment Method:</span>
                    <span className="text-sm font-medium">
                      {paymentData.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amount Paid:</span>
                    <span className="text-lg font-bold text-green-600">${paymentData.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Invoice ID:</span>
                    <span className="text-sm font-medium">{selectedInvoice?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Patient:</span>
                    <span className="text-sm font-medium">{selectedInvoice?.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Description:</span>
                    <span className="text-sm font-medium">{selectedInvoice?.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Due Date:</span>
                    <span className="text-sm font-medium">
                      {selectedInvoice && new Date(selectedInvoice.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {paymentData.notes && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                <p className="text-sm text-gray-700">{paymentData.notes}</p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">Thank you for your payment!</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetForm}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Process Another Payment
                </button>
                <Link
                  href="/invoices"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Return to Invoices
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <Header sidebarCollapsed={sidebarCollapsed} />
      <div className={`transition-all duration-300 pt-20 ${sidebarCollapsed ? 'ml-14' : 'ml-56'}`}>
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center space-x-4">
                <Link href="/invoices" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  <ArrowLeftIcon className="h-6 w-6" />
                </Link>
                <div className="flex items-center space-x-3">
                  <CreditCardIcon className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Processing</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Process patient payments securely</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Invoice Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Invoice to Pay</h3>
            
            {errors.invoice && <p className="text-red-500 text-sm mb-4">{errors.invoice}</p>}
            
            <div className="space-y-3">
              {mockOutstandingInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                    selectedInvoice?.id === invoice.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } ${invoice.isOverdue ? 'border-red-200 bg-red-50' : ''}`}
                  onClick={() => setSelectedInvoice(invoice)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-blue-600">{invoice.id}</span>
                        {invoice.isOverdue && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            Overdue
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-900 font-medium">{invoice.patientName}</p>
                      <p className="text-sm text-gray-600">{invoice.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${invoice.amount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Information</h3>
            
            {/* Payment Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={selectedInvoice?.amount || 0}
                  className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={paymentData.amount || ''}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  disabled={!selectedInvoice}
                />
              </div>
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              {selectedInvoice && (
                <p className="text-sm text-gray-600 mt-1">
                  Maximum: ${selectedInvoice.amount.toFixed(2)}
                </p>
              )}
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'credit_card', label: 'Credit Card', icon: CreditCardIcon },
                  { value: 'debit_card', label: 'Debit Card', icon: CreditCardIcon },
                  { value: 'check', label: 'Check', icon: BanknoteIcon },
                  { value: 'cash', label: 'Cash', icon: DollarSignIcon },
                  { value: 'bank_transfer', label: 'Bank Transfer', icon: BuildingIcon },
                  { value: 'insurance', label: 'Insurance', icon: ShieldCheckIcon }
                ].map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    className={`flex items-center space-x-2 p-3 border rounded-lg text-sm font-medium transition-colors duration-200 ${
                      paymentData.paymentMethod === method.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                    onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: method.value }))}
                  >
                    <method.icon className="h-4 w-4" />
                    <span>{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Specific Fields */}
            {(paymentData.paymentMethod === 'credit_card' || paymentData.paymentMethod === 'debit_card') && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    maxLength={19}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                  />
                  {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={paymentData.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.substring(0, 2) + '/' + value.substring(2, 4);
                        }
                        setPaymentData(prev => ({ ...prev, expiryDate: value }));
                      }}
                    />
                    {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.cvv ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                    />
                    {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                    value={paymentData.cardholderName}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, cardholderName: e.target.value }))}
                  />
                  {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
                </div>
              </div>
            )}

            {paymentData.paymentMethod === 'check' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check Number
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.checkNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1001"
                    value={paymentData.checkNumber}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, checkNumber: e.target.value }))}
                  />
                  {errors.checkNumber && <p className="text-red-500 text-sm mt-1">{errors.checkNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.bankName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="First National Bank"
                    value={paymentData.bankName}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, bankName: e.target.value }))}
                  />
                  {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
                </div>
              </div>
            )}

            {paymentData.paymentMethod === 'bank_transfer' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1234567890"
                    value={paymentData.accountNumber}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, accountNumber: e.target.value }))}
                  />
                  {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    maxLength={9}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.routingNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123456789"
                    value={paymentData.routingNumber}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, routingNumber: e.target.value.replace(/\D/g, '') }))}
                  />
                  {errors.routingNumber && <p className="text-red-500 text-sm mt-1">{errors.routingNumber}</p>}
                </div>
              </div>
            )}

            {paymentData.paymentMethod === 'cash' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Received By
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.receivedBy ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Staff member name"
                  value={paymentData.receivedBy}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, receivedBy: e.target.value }))}
                />
                {errors.receivedBy && <p className="text-red-500 text-sm mt-1">{errors.receivedBy}</p>}
              </div>
            )}

            {paymentData.paymentMethod === 'insurance' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Provider
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.insuranceProvider ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Blue Cross Blue Shield"
                    value={paymentData.insuranceProvider}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, insuranceProvider: e.target.value }))}
                  />
                  {errors.insuranceProvider && <p className="text-red-500 text-sm mt-1">{errors.insuranceProvider}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Authorization Number
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.authorizationNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="AUTH123456789"
                    value={paymentData.authorizationNumber}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, authorizationNumber: e.target.value }))}
                  />
                  {errors.authorizationNumber && <p className="text-red-500 text-sm mt-1">{errors.authorizationNumber}</p>}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional payment notes or comments..."
                value={paymentData.notes}
                onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            {/* Security Notice */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <LockIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Secure Payment Processing</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                All payment information is encrypted and processed securely. We never store sensitive payment details.
              </p>
            </div>

            {/* Process Payment Button */}
            <button
              onClick={processPayment}
              disabled={!selectedInvoice || isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCwIcon className="h-4 w-4 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CreditCardIcon className="h-4 w-4" />
                  <span>Process Payment</span>
                </>
              )}
            </button>

            {paymentResult && !paymentResult.success && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircleIcon className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-red-900">Payment Failed</span>
                </div>
                <p className="text-sm text-red-700 mt-1">{paymentResult.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}