'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCardIcon,
  DollarSignIcon,
  BanknoteIcon,
  BuildingIcon,
  ShieldCheckIcon,
  RefreshCwIcon,
  CheckIcon,
  ArrowLeftIcon,
  UserIcon,
  LockIcon,
  Building2,
  Pill,
  Stethoscope,
  ShoppingCart,
  Package,
  Heart,
  Activity,
  FileText,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/shared/header';
import Footer from '@/components/shared/footer';

// ---------- Mock Data ----------
const mockOutstandingInvoices = [
  // Hospital Billing
  {
    id: 'HSP-2024-001',
    patientName: 'John Smith',
    patientId: 'PAT001',
    amount: 234.0,
    dueDate: '2024-12-01',
    description: 'Office Visit & Lab Work',
    type: 'hospital',
    category: 'OPD',
    department: 'General Medicine',
    physician: 'Dr. Anderson',
    services: ['Consultation', 'Blood Test', 'ECG']
  },
  {
    id: 'HSP-2024-002',
    patientName: 'Sarah Johnson',
    patientId: 'PAT002',
    amount: 1085.0,
    dueDate: '2024-11-27',
    description: 'Emergency Department Visit',
    type: 'hospital',
    category: 'Emergency',
    department: 'Emergency Medicine',
    physician: 'Dr. Roberts',
    isOverdue: true,
    services: ['Emergency Consultation', 'X-Ray', 'CT Scan']
  },
  {
    id: 'HSP-2024-003',
    patientName: 'Michael Brown',
    patientId: 'PAT003',
    amount: 450.0,
    dueDate: '2024-12-15',
    description: 'Cardiology Consultation',
    type: 'hospital',
    category: 'OPD',
    department: 'Cardiology',
    physician: 'Dr. Martinez',
    services: ['Cardiology Consultation', 'Echo Test']
  },
  {
    id: 'PKG-2024-001',
    patientName: 'Emma Davis',
    patientId: 'PAT004',
    amount: 6800.0,
    dueDate: '2024-12-20',
    description: 'Complete Maternity Package',
    type: 'hospital',
    category: 'Package',
    department: 'Maternity',
    physician: 'Dr. Wilson',
    services: ['Prenatal Care', 'Delivery', 'Postpartum Care']
  },
  // Pharmacy/POS Billing
  {
    id: 'POS-2024-001',
    patientName: 'David Wilson',
    patientId: 'PAT005',
    amount: 89.50,
    dueDate: '2024-11-30',
    description: 'Prescription Medications',
    type: 'pharmacy',
    category: 'Prescription',
    pharmacist: 'PharmD Jones',
    items: [
      { name: 'Amoxicillin 500mg', qty: 21, price: 25.00 },
      { name: 'Lisinopril 10mg', qty: 30, price: 35.50 },
      { name: 'Vitamin D3', qty: 60, price: 29.00 }
    ]
  },
  {
    id: 'POS-2024-002',
    patientName: 'Lisa Chen',
    patientId: 'PAT006',
    amount: 156.75,
    dueDate: '2024-12-05',
    description: 'Medical Supplies & OTC',
    type: 'pharmacy',
    category: 'Retail',
    pharmacist: 'PharmD Smith',
    items: [
      { name: 'Blood Pressure Monitor', qty: 1, price: 89.99 },
      { name: 'Thermometer Digital', qty: 2, price: 15.99 },
      { name: 'First Aid Kit', qty: 1, price: 34.77 }
    ]
  },
  {
    id: 'POS-2024-003',
    patientName: 'Robert Taylor',
    patientId: 'PAT007',
    amount: 267.30,
    dueDate: '2024-12-10',
    description: 'Chronic Care Medications',
    type: 'pharmacy',
    category: 'Prescription',
    pharmacist: 'PharmD Brown',
    isOverdue: false,
    items: [
      { name: 'Metformin 1000mg', qty: 90, price: 45.00 },
      { name: 'Atorvastatin 20mg', qty: 30, price: 67.50 },
      { name: 'Aspirin 81mg', qty: 100, price: 12.80 },
      { name: 'Insulin Glargine', qty: 1, price: 142.00 }
    ]
  }
];

interface PaymentFormData {
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  checkNumber: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  receivedBy: string;
  insuranceProvider: string;
  authorizationNumber: string;
  notes: string;
}

interface PaymentResult {
  success: boolean;
  transactionId: string;
  receiptNumber: string;
  timestamp: string;
  message: string;
}

// ---------- POS Method Button ----------
function POSMethodButton({
  icon: Icon,
  label,
  method,
  active,
  onSelect,
}: {
  icon: any;
  label: string;
  method: string;
  active?: boolean;
  onSelect: (method: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(method)}
      className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all
      ${
        active
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'
      }`}
    >
      <Icon className="h-6 w-6 mb-1" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

// ---------- POS Keypad ----------
function POSKeypad({ onInput }: { onInput: (val: string) => void }) {
  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '←'];
  return (
    <div className="grid grid-cols-3 gap-3 mt-4">
      {keys.map((k) => (
        <button
          key={k}
          onClick={() => onInput(k)}
          className="p-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-xl font-semibold"
        >
          {k}
        </button>
      ))}
    </div>
  );
}

// ---------- Main POS Component ----------
export default function PaymentProcessing() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [invoiceFilter, setInvoiceFilter] = useState('all'); // 'all', 'hospital', 'pharmacy'
  const [searchTerm, setSearchTerm] = useState('');
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
    notes: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [amountInput, setAmountInput] = useState('');

  // Filter invoices based on type and search
  const filteredInvoices = mockOutstandingInvoices.filter(invoice => {
    const matchesFilter = invoiceFilter === 'all' || invoice.type === invoiceFilter;
    const matchesSearch = invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getInvoiceIcon = (invoice: any) => {
    if (invoice.type === 'hospital') {
      if (invoice.category === 'Package') return Heart;
      if (invoice.category === 'Emergency') return Activity;
      return Stethoscope;
    }
    return invoice.category === 'Prescription' ? Pill : ShoppingCart;
  };

  const getInvoiceTypeColor = (invoice: any) => {
    if (invoice.type === 'hospital') {
      return invoice.category === 'Emergency' ? 'text-red-600' : 'text-blue-600';
    }
    return 'text-green-600';
  };

  useEffect(() => {
    if (selectedInvoice) {
      setPaymentData((prev) => ({
        ...prev,
        invoiceId: selectedInvoice.id,
        amount: selectedInvoice.amount,
      }));
      setAmountInput(selectedInvoice.amount.toFixed(2));
    }
  }, [selectedInvoice]);

  const handleKeypadInput = (val: string) => {
    if (val === '←') {
      setAmountInput((prev) => prev.slice(0, -1));
    } else {
      setAmountInput((prev) => prev + val);
    }
    const num = parseFloat(amountInput + val);
    setPaymentData((prev) => ({ ...prev, amount: isNaN(num) ? 0 : num }));
  };

  const processPayment = async () => {
    if (!selectedInvoice) {
      alert('Select an invoice first.');
      return;
    }
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPaymentResult({
      success: true,
      transactionId: `TXN${Date.now()}`,
      receiptNumber: `RCP${Date.now()}`,
      timestamp: new Date().toISOString(),
      message: 'Payment successful',
    });
    setIsProcessing(false);
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
      notes: '',
    });
    setPaymentResult(null);
    setAmountInput('');
  };

  // ---------- Success Screen ----------
  if (paymentResult?.success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white text-center">
        <CheckIcon className="h-16 w-16 text-green-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful</h1>
        <p className="text-gray-600 mb-8">
          Transaction #{paymentResult.transactionId} • Receipt #{paymentResult.receiptNumber}
        </p>
        <div className="flex space-x-4">
          <button
            onClick={resetForm}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Process Another Payment
          </button>
          <Link
            href="/invoices"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-semibold"
          >
            Return to Invoices
          </Link>
        </div>
      </div>
    );
  }

  // ---------- POS UI ----------
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <Header sidebarCollapsed={sidebarCollapsed} />

      <div className={`flex flex-1 transition-all duration-300 pt-16 ${sidebarCollapsed ? 'ml-14' : 'ml-56'}`}>
        {/* LEFT PANEL */}
        <aside className="w-1/3 bg-white border-r p-4 overflow-y-auto shadow-md">
          <div className="flex items-center mb-4 justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" /> Pending Invoices
            </h2>
            <span className="text-sm text-gray-500">{filteredInvoices.length} invoices</span>
          </div>

          {/* Search and Filter */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setInvoiceFilter('all')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  invoiceFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setInvoiceFilter('hospital')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                  invoiceFilter === 'hospital' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Stethoscope className="h-3 w-3" /> Hospital
              </button>
              <button
                onClick={() => setInvoiceFilter('pharmacy')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                  invoiceFilter === 'pharmacy' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Pill className="h-3 w-3" /> Pharmacy
              </button>
            </div>
          </div>

          {/* Invoice List */}
          {filteredInvoices.map((invoice) => {
            const IconComponent = getInvoiceIcon(invoice);
            return (
              <div
                key={invoice.id}
                onClick={() => setSelectedInvoice(invoice)}
                className={`p-4 mb-3 rounded-lg border cursor-pointer transition-all ${
                  selectedInvoice?.id === invoice.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                } ${
                  invoice.isOverdue ? 'border-l-4 border-l-red-500' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <IconComponent className={`h-4 w-4 ${getInvoiceTypeColor(invoice)}`} />
                      <p className="font-semibold text-gray-800 text-sm">{invoice.patientName}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.type === 'hospital' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {invoice.type === 'hospital' ? invoice.category : 'Pharmacy'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{invoice.id} • {invoice.patientId}</p>
                    <p className="text-sm text-gray-500">{invoice.description}</p>
                    {invoice.type === 'hospital' && invoice.physician && (
                      <p className="text-xs text-gray-400">👨‍⚕️ {invoice.physician}</p>
                    )}
                    {invoice.type === 'pharmacy' && invoice.pharmacist && (
                      <p className="text-xs text-gray-400">💊 {invoice.pharmacist}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-400">
                        Due {new Date(invoice.dueDate).toLocaleDateString()}
                        {invoice.isOverdue && <span className="text-red-600 font-medium ml-1">(Overdue)</span>}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      invoice.isOverdue ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      ${invoice.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredInvoices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No invoices found</p>
            </div>
          )}
        </aside>

        {/* RIGHT PANEL */}
        <main className="flex-1 flex flex-col p-6 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow flex flex-col flex-1">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CreditCardIcon className="h-6 w-6 text-blue-600" /> Payment Terminal
                </h1>
                {selectedInvoice ? (
                  <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
                    <div className="flex items-center gap-3 mb-3">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                      <span className="font-semibold text-lg">{selectedInvoice.patientName}</span>
                      <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                        {selectedInvoice.patientId}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedInvoice.type === 'hospital' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedInvoice.type === 'hospital' ? '🏥 Hospital' : '💊 Pharmacy'}
                      </span>
                      {selectedInvoice.isOverdue && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          Overdue
                        </span>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p><span className="font-medium text-gray-600">Invoice ID:</span> {selectedInvoice.id}</p>
                        <p><span className="font-medium text-gray-600">Service:</span> {selectedInvoice.description}</p>
                        <p><span className="font-medium text-gray-600">Due Date:</span> {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="space-y-1">
                        {selectedInvoice.type === 'hospital' && (
                          <>
                            <p><span className="font-medium text-gray-600">Department:</span> {selectedInvoice.department}</p>
                            <p><span className="font-medium text-gray-600">Provider:</span> {selectedInvoice.physician}</p>
                            {selectedInvoice.services && (
                              <p><span className="font-medium text-gray-600">Services:</span> {selectedInvoice.services.join(', ')}</p>
                            )}
                          </>
                        )}
                        {selectedInvoice.type === 'pharmacy' && (
                          <>
                            <p><span className="font-medium text-gray-600">Pharmacist:</span> {selectedInvoice.pharmacist}</p>
                            <p><span className="font-medium text-gray-600">Items:</span> {selectedInvoice.items?.length || 0} items</p>
                            {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                              <div className="mt-2">
                                <p className="font-medium text-gray-600 mb-1">Items:</p>
                                <div className="max-h-20 overflow-y-auto text-xs space-y-1">
                                  {selectedInvoice.items.map((item: any, index: number) => (
                                    <div key={index} className="flex justify-between bg-white p-1 rounded">
                                      <span>{item.name} x{item.qty}</span>
                                      <span>${item.price.toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 text-center text-gray-500 py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <CreditCardIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">Select an invoice to process payment</p>
                    <p className="text-sm">Choose from hospital or pharmacy invoices on the left</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Input - Only show when invoice is selected */}
            {selectedInvoice && (
              <div className="flex flex-col md:flex-row gap-8 flex-1">
                {/* LEFT: Amount + Keypad */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Payment Amount
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={`$${amountInput || '0.00'}`}
                      className="text-4xl font-bold w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 pb-2 text-right bg-transparent"
                    />
                    <div className="absolute top-0 right-0 text-sm text-gray-500">
                      Invoice: ${selectedInvoice.amount.toFixed(2)}
                    </div>
                  </div>
                  <POSKeypad onInput={handleKeypadInput} />
                </div>

                {/* RIGHT: Payment Method */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <POSMethodButton
                      icon={CreditCardIcon}
                      label="Card"
                      method="credit_card"
                      active={paymentData.paymentMethod === 'credit_card'}
                      onSelect={(m) => setPaymentData((p) => ({ ...p, paymentMethod: m }))}
                    />
                    <POSMethodButton
                      icon={DollarSignIcon}
                      label="Cash"
                      method="cash"
                      active={paymentData.paymentMethod === 'cash'}
                      onSelect={(m) => setPaymentData((p) => ({ ...p, paymentMethod: m }))}
                    />
                    <POSMethodButton
                      icon={ShieldCheckIcon}
                      label="Insurance"
                      method="insurance"
                      active={paymentData.paymentMethod === 'insurance'}
                      onSelect={(m) => setPaymentData((p) => ({ ...p, paymentMethod: m }))}
                    />
                    <POSMethodButton
                      icon={BanknoteIcon}
                      label="Check"
                      method="check"
                      active={paymentData.paymentMethod === 'check'}
                      onSelect={(m) => setPaymentData((p) => ({ ...p, paymentMethod: m }))}
                    />
                    <POSMethodButton
                      icon={BuildingIcon}
                      label="Transfer"
                      method="bank_transfer"
                      active={paymentData.paymentMethod === 'bank_transfer'}
                      onSelect={(m) => setPaymentData((p) => ({ ...p, paymentMethod: m }))}
                    />
                  </div>

                  {/* Payment Method Specific Fields */}
                  {paymentData.paymentMethod === 'insurance' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Insurance Provider
                      </label>
                      <input
                        type="text"
                        placeholder="Enter insurance provider"
                        value={paymentData.insuranceProvider}
                        onChange={(e) => setPaymentData(p => ({ ...p, insuranceProvider: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {paymentData.paymentMethod === 'check' && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter check number"
                        value={paymentData.checkNumber}
                        onChange={(e) => setPaymentData(p => ({ ...p, checkNumber: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {/* Notes */}
                  <textarea
                    rows={3}
                    className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Payment notes (optional)"
                    value={paymentData.notes}
                    onChange={(e) =>
                      setPaymentData((p) => ({ ...p, notes: e.target.value }))
                    }
                  />

                  {/* Security Notice */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg text-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <LockIcon className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-900">
                        Secure {selectedInvoice.type === 'hospital' ? 'Hospital' : 'Pharmacy'} Payment System
                      </span>
                    </div>
                    <p className="text-blue-700">
                      All transactions are encrypted and compliant with HIPAA & PCI standards.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Bar - Only show when invoice is selected */}
            {selectedInvoice && (
              <div className="mt-8 flex justify-between items-center border-t pt-6 bg-gray-50 -mx-6 px-6 rounded-b-xl">
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-sm text-gray-500">Invoice Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${selectedInvoice.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Amount</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${parseFloat(amountInput || '0').toFixed(2)}
                    </p>
                  </div>
                  {parseFloat(amountInput || '0') !== selectedInvoice.amount && (
                    <div>
                      <p className="text-sm text-gray-500">
                        {parseFloat(amountInput || '0') > selectedInvoice.amount ? 'Change' : 'Remaining'}
                      </p>
                      <p className={`text-xl font-bold ${
                        parseFloat(amountInput || '0') > selectedInvoice.amount ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        ${Math.abs(parseFloat(amountInput || '0') - selectedInvoice.amount).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Clear
                  </button>
                  <button
                    onClick={processPayment}
                    disabled={!selectedInvoice || isProcessing || !amountInput || parseFloat(amountInput) <= 0}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 min-w-[160px] justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCwIcon className="animate-spin h-5 w-5" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CreditCardIcon className="h-5 w-5" />
                        <span>
                          {parseFloat(amountInput || '0') >= selectedInvoice.amount 
                            ? 'Complete Payment' 
                            : 'Partial Payment'
                          }
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
