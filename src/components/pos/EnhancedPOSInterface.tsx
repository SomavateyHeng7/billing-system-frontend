"use client";

import React, { useState, useRef } from 'react';
import { 
  ShoppingCart, Plus, Minus, Trash2, Scan, CreditCard, Receipt, X, 
  User, FileText, Building2, Pill, Stethoscope, Calculator, Percent,
  Download, Mail, Printer, AlertTriangle, Clock, UserCheck
} from 'lucide-react';
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

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  insuranceNumber?: string;
  insuranceProvider?: string;
  dateOfBirth?: string;
  address?: string;
}

export interface Transaction {
  id: string;
  date: string;
  time: string;
  patient?: Patient;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  billingType: 'pharmacy' | 'hospital';
  cashierName: string;
  pharmacistName?: string;
  doctorName?: string;
  departmentName?: string;
  insuranceCovered: number;
  patientPortion: number;
  notes?: string;
}

const EnhancedPOSInterface: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'amount' | 'percentage'>('percentage');
  const [taxRate] = useState(0.08);
  const [billingType, setBillingType] = useState<'pharmacy' | 'hospital'>('pharmacy');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [insuranceCoverage, setInsuranceCoverage] = useState(0);
  const [notes, setNotes] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  // Enhanced product database with hospital services
  const mockProducts = [
    // Pharmacy Products
    {
      id: 'p1',
      name: 'Paracetamol 500mg',
      barcode: '1234567890123',
      price: 12.50,
      type: 'otc' as const,
      category: 'pharmacy' as const,
      manufacturer: 'PharmaCorp',
      stock: 150
    },
    {
      id: 'p2',
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
      id: 'p3',
      name: 'Insulin Pen',
      barcode: '4567890123456',
      price: 89.99,
      type: 'prescription' as const,
      category: 'pharmacy' as const,
      dosage: '100 units/mL',
      manufacturer: 'DiabetesCare',
      stock: 25
    },
    // Hospital Services
    {
      id: 'h1',
      name: 'General Consultation',
      barcode: 'CONS001',
      price: 150.00,
      type: 'consultation' as const,
      category: 'hospital' as const,
      department: 'General Medicine',
      duration: '30 minutes'
    },
    {
      id: 'h2',
      name: 'Blood Test - Complete Panel',
      barcode: 'LAB001',
      price: 85.00,
      type: 'procedure' as const,
      category: 'hospital' as const,
      department: 'Laboratory',
      duration: '15 minutes'
    },
    {
      id: 'h3',
      name: 'X-Ray Chest',
      barcode: 'XRAY001',
      price: 120.00,
      type: 'procedure' as const,
      category: 'hospital' as const,
      department: 'Radiology',
      duration: '20 minutes'
    },
    {
      id: 'h4',
      name: 'Emergency Room Visit',
      barcode: 'ER001',
      price: 350.00,
      type: 'service' as const,
      category: 'hospital' as const,
      department: 'Emergency',
      duration: 'Variable'
    },
    {
      id: 'h5',
      name: 'Physiotherapy Session',
      barcode: 'PHYSIO001',
      price: 80.00,
      type: 'service' as const,
      category: 'hospital' as const,
      department: 'Physiotherapy',
      duration: '45 minutes'
    }
  ];

  // Mock patients
  const mockPatients: Patient[] = [
    {
      id: '1',
      name: 'John Doe',
      phone: '+1-555-0123',
      email: 'john.doe@email.com',
      insuranceNumber: 'INS123456789',
      insuranceProvider: 'HealthFirst Insurance',
      dateOfBirth: '1985-03-15',
      address: '123 Main St, City, State 12345'
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '+1-555-0456',
      email: 'jane.smith@email.com',
      insuranceNumber: 'INS987654321',
      insuranceProvider: 'MediCare Plus',
      dateOfBirth: '1990-07-22',
      address: '456 Oak Ave, City, State 12345'
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
        category: productData.category,
        dosage: productData.dosage,
        manufacturer: productData.manufacturer,
        expiryDate: productData.expiryDate,
        batchNumber: productData.batchNumber,
        serviceType: productData.serviceType,
        department: productData.department,
        duration: productData.duration
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
    setSelectedPatient(null);
    setInsuranceCoverage(0);
    setNotes('');
  };

  const handleBarcodeScanned = (barcode: string) => {
    const product = mockProducts.find(p => p.barcode === barcode);
    if (product) {
      addToCart(product);
      setShowScanner(false);
    } else {
      alert('Product/Service not found! Please add manually.');
    }
  };

  const selectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowPatientSearch(false);
    // Auto-calculate insurance coverage (mock)
    if (patient.insuranceProvider) {
      setInsuranceCoverage(0.8); // 80% coverage
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    if (discountType === 'percentage') {
      return calculateSubtotal() * (discount / 100);
    }
    return discount;
  };

  const calculateTax = () => {
    return (calculateSubtotal() - calculateDiscount()) * taxRate;
  };

  const calculateInsuranceCovered = () => {
    const afterDiscount = calculateSubtotal() - calculateDiscount();
    return afterDiscount * insuranceCoverage;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    const tax = calculateTax();
    const insuranceCovered = calculateInsuranceCovered();
    return subtotal - discountAmount + tax - insuranceCovered;
  };

  const handlePayment = (paymentMethod: string) => {
    const transaction: Transaction = {
      id: `TXN-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      patient: selectedPatient || undefined,
      items: [...cart],
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      discount: calculateDiscount(),
      total: calculateTotal(),
      paymentMethod: paymentMethod,
      billingType: billingType,
      cashierName: 'Current User',
      pharmacistName: billingType === 'pharmacy' ? 'Dr. Smith' : undefined,
      doctorName: billingType === 'hospital' ? 'Dr. Johnson' : undefined,
      departmentName: billingType === 'hospital' ? cart[0]?.department : undefined,
      insuranceCovered: calculateInsuranceCovered(),
      patientPortion: calculateTotal(),
      notes: notes
    };
    
    setCurrentTransaction(transaction);
    setShowPayment(false);
    setShowReceipt(true);
    clearCart();
  };

  const filteredProducts = mockProducts.filter(product => 
    billingType === 'pharmacy' ? product.category === 'pharmacy' : product.category === 'hospital'
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Main Interface */}
      <div className="lg:col-span-2 space-y-6">
        {/* Billing Type Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Billing Mode</h3>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setBillingType('pharmacy')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  billingType === 'pharmacy'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <Pill size={16} />
                Pharmacy
              </button>
              <button
                onClick={() => setBillingType('hospital')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  billingType === 'hospital'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <Stethoscope size={16} />
                Hospital Services
              </button>
            </div>
          </div>

          {/* Patient Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Patient Information
              </label>
              <button
                onClick={() => setShowPatientSearch(true)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {selectedPatient ? (
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{selectedPatient.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{selectedPatient.phone}</div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <User size={16} />
                    Select Patient
                  </div>
                )}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Insurance Coverage
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={insuranceCoverage}
                  onChange={(e) => setInsuranceCoverage(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
                  {(insuranceCoverage * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Scanner */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <ProductSearch 
                products={filteredProducts}
                onProductSelect={addToCart}
                ref={searchRef}
                placeholder={`Search ${billingType === 'pharmacy' ? 'medications' : 'services'} by name or code...`}
              />
            </div>
            <button
              onClick={() => setShowScanner(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Scan size={18} />
              Scan Code
            </button>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {billingType === 'pharmacy' ? 'Quick Add Medications' : 'Common Services'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.slice(0, 8).map((product) => (
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
                    : product.type === 'consultation'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : product.type === 'procedure'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {product.type === 'prescription' ? 'RX' :
                   product.type === 'consultation' ? 'CONSULT' :
                   product.type === 'procedure' ? 'PROC' :
                   product.type === 'service' ? 'SERVICE' : 'OTC'}
                </div>
                {product.department && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {product.department}
                  </div>
                )}
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
              {billingType === 'pharmacy' ? 'Prescription' : 'Services'} ({cart.length})
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
            billingType={billingType}
          />
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              {/* Discount Controls */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Discount:</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as 'amount' | 'percentage')}
                      className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-600 dark:text-white"
                    >
                      <option value="percentage">%</option>
                      <option value="amount">$</option>
                    </select>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                      className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                
                {calculateDiscount() > 0 && (
                  <div className="flex justify-between text-sm text-red-600 dark:text-red-400">
                    <span>Discount:</span>
                    <span>-${calculateDiscount().toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Tax ({(taxRate * 100).toFixed(0)}%):</span>
                  <span className="font-medium">${calculateTax().toFixed(2)}</span>
                </div>
                
                {insuranceCoverage > 0 && (
                  <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400">
                    <span>Insurance ({(insuranceCoverage * 100).toFixed(0)}%):</span>
                    <span>-${calculateInsuranceCovered().toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-3">
                  <span>Patient Pays:</span>
                  <span className="text-green-600 dark:text-green-400">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes (prescription instructions, special requests, etc.)"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  rows={2}
                />
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
              {billingType === 'pharmacy' ? <Pill size={48} /> : <Stethoscope size={48} />}
              <p className="mt-4">Cart is empty</p>
              <p className="text-sm">
                {billingType === 'pharmacy' 
                  ? 'Scan or search for medications to add' 
                  : 'Add services and procedures to begin billing'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Patient Search Modal */}
      {showPatientSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select Patient</h2>
                <button
                  onClick={() => setShowPatientSearch(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                {mockPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => selectPatient(patient)}
                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{patient.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{patient.phone}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{patient.email}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-blue-600 dark:text-blue-400">{patient.insuranceProvider}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{patient.insuranceNumber}</div>
                      </div>
                    </div>
                  </button>
                ))}
                
                <button className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
                  <div className="flex items-center justify-center gap-2">
                    <Plus size={20} />
                    Add New Patient
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Existing Modals */}
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
          billingType={billingType}
          patient={selectedPatient}
        />
      )}

      {showReceipt && currentTransaction && (
        <ReceiptModal
          isOpen={showReceipt}
          receipt={currentTransaction}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default EnhancedPOSInterface;