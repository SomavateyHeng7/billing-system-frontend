'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  SearchIcon,
  UserIcon,
  CalendarIcon,
  ReceiptIcon,
  SaveIcon,
  MailIcon,
  CalculatorIcon
} from 'lucide-react';
import { Sidebar } from '../../../components/layout/sidebar';
import { Header } from '@/src/components/shared/header';
import Footer from '@/src/components/shared/footer';

// Mock data for patients and services
const mockPatients = [
  { id: 1, name: 'John Smith', insurance: 'Blue Cross Blue Shield', phone: '(555) 123-4567' },
  { id: 2, name: 'Sarah Johnson', insurance: 'Aetna', phone: '(555) 987-6543' },
  { id: 3, name: 'Michael Brown', insurance: 'Medicare', phone: '(555) 456-7890' }
];

const mockServices = [
  { code: '99213', description: 'Office Visit - Established Patient', price: 200.00, category: 'Office Visits' },
  { code: '99214', description: 'Office Visit - Detailed', price: 275.00, category: 'Office Visits' },
  { code: '99215', description: 'Office Visit - Comprehensive', price: 350.00, category: 'Office Visits' },
  { code: '99285', description: 'Emergency Department Visit - High Complexity', price: 800.00, category: 'Emergency' },
  { code: '80053', description: 'Comprehensive Metabolic Panel', price: 150.00, category: 'Lab Tests' },
  { code: '85025', description: 'Complete Blood Count', price: 100.00, category: 'Lab Tests' },
  { code: '71020', description: 'Chest X-Ray', price: 200.00, category: 'Imaging' },
  { code: '36415', description: 'Blood Draw', price: 50.00, category: 'Procedures' },
  { code: '90471', description: 'Immunization Administration', price: 25.00, category: 'Procedures' },
  { code: 'J3420', description: 'B-12 Injection', price: 75.00, category: 'Medications' }
];

interface LineItem {
  id: string;
  serviceCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
}

interface InvoiceData {
  patientId: number | null;
  patientName: string;
  dateIssued: string;
  dueDate: string;
  provider: string;
  notes: string;
  lineItems: LineItem[];
  discountAmount: number;
  taxRate: number;
  isRecurring: boolean;
  recurringInterval: string;
}

export default function NewInvoice() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    patientId: null,
    patientName: '',
    dateIssued: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    provider: '',
    notes: '',
    lineItems: [],
    discountAmount: 0,
    taxRate: 0,
    isRecurring: false,
    recurringInterval: 'monthly'
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [showServiceSearch, setShowServiceSearch] = useState(false);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
    patient.phone.includes(patientSearchTerm)
  );

  const filteredServices = mockServices.filter(service =>
    service.code.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(serviceSearchTerm.toLowerCase())
  );

  const handlePatientSelect = (patient: typeof mockPatients[0]) => {
    setInvoiceData(prev => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name
    }));
    setShowPatientSearch(false);
    setPatientSearchTerm('');
  };

  const addLineItem = (service: typeof mockServices[0]) => {
    const newLineItem: LineItem = {
      id: Date.now().toString(),
      serviceCode: service.code,
      description: service.description,
      quantity: 1,
      unitPrice: service.price,
      total: service.price,
      notes: ''
    };

    setInvoiceData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newLineItem]
    }));
    setShowServiceSearch(false);
    setServiceSearchTerm('');
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setInvoiceData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.total = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      })
    }));
  };

  const removeLineItem = (id: string) => {
    setInvoiceData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }));
  };

  const calculateSubtotal = () => {
    return invoiceData.lineItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() - invoiceData.discountAmount) * (invoiceData.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - invoiceData.discountAmount + calculateTax();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!invoiceData.patientId) {
      newErrors.patient = 'Please select a patient';
    }
    if (!invoiceData.provider.trim()) {
      newErrors.provider = 'Provider is required';
    }
    if (invoiceData.lineItems.length === 0) {
      newErrors.lineItems = 'At least one service/item is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (action: 'draft' | 'send') => {
    if (!validateForm()) return;

    console.log('Saving invoice as:', action, invoiceData);
    alert(`Invoice ${action === 'draft' ? 'saved as draft' : 'created and sent'} successfully!`);
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/invoices" className="text-blue-600 hover:text-blue-800">
                  <ArrowLeftIcon className="h-6 w-6" />
                </Link>
                <div className="flex items-center space-x-3">
                  <ReceiptIcon className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Invoice</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Add services and generate patient invoice</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleSave('draft')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                >
                  <SaveIcon className="h-4 w-4" />
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={() => handleSave('send')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                >
                  <MailIcon className="h-4 w-4" />
                  <span>Create & Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Invoice Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Invoice Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Patient *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search and select patient..."
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                        errors.patient ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      value={invoiceData.patientName || patientSearchTerm}
                      onChange={(e) => {
                        setPatientSearchTerm(e.target.value);
                        setShowPatientSearch(true);
                      }}
                      onFocus={() => setShowPatientSearch(true)}
                    />
                    {showPatientSearch && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredPatients.map(patient => (
                          <div
                            key={patient.id}
                            className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            onClick={() => handlePatientSelect(patient)}
                          >
                            <div className="flex items-center space-x-3">
                              <UserIcon className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{patient.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{patient.insurance} • {patient.phone}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.patient && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.patient}</p>}
                </div>

                {/* Provider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Provider *
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.provider ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    value={invoiceData.provider}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, provider: e.target.value }))}
                    placeholder="e.g., Dr. Johnson"
                  />
                  {errors.provider && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.provider}</p>}
                </div>

                {/* Date Issued */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Issued
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={invoiceData.dateIssued}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, dateIssued: e.target.value }))}
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={invoiceData.dueDate}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>

              {/* Recurring Billing Option */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="recurring"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={invoiceData.isRecurring}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                  />
                  <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                    Set up recurring billing
                  </label>
                </div>
                {invoiceData.isRecurring && (
                  <div className="mt-3">
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={invoiceData.recurringInterval}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, recurringInterval: e.target.value }))}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Services & Procedures</h3>
                <button
                  onClick={() => setShowServiceSearch(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Service</span>
                </button>
              </div>

              {errors.lineItems && <p className="text-red-500 text-sm mb-4">{errors.lineItems}</p>}

              {/* Service Search Modal */}
              {showServiceSearch && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Select Service/Procedure</h3>
                        <button 
                          onClick={() => setShowServiceSearch(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      </div>
                      <div className="relative">
                        <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search by code, description, or category..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={serviceSearchTerm}
                          onChange={(e) => setServiceSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto max-h-80 p-4">
                      <div className="grid grid-cols-1 gap-2">
                        {filteredServices.map(service => (
                          <div
                            key={service.code}
                            className="p-3 hover:bg-gray-50 cursor-pointer border border-gray-200 rounded-lg"
                            onClick={() => addLineItem(service)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <span className="text-sm font-medium text-blue-600">{service.code}</span>
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                    {service.category}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-900 mt-1">{service.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">${service.price.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Line Items Table */}
              {invoiceData.lineItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {invoiceData.lineItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-4 text-sm font-medium text-blue-600">
                            {item.serviceCode}
                          </td>
                          <td className="px-4 py-4">
                            <input
                              type="text"
                              className="w-full text-sm border-none focus:ring-0 focus:outline-none"
                              value={item.description}
                              onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-4">
                            <input
                              type="number"
                              min="1"
                              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={item.quantity}
                              onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-500">$</span>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={item.unitPrice}
                                onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                            ${item.total.toFixed(2)}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => removeLineItem(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ReceiptIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No services added yet</p>
                  <p className="text-sm text-gray-400 mt-2">Click "Add Service" to start building your invoice</p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any additional notes or special instructions..."
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <div className="flex items-center space-x-2 mb-6">
                <CalculatorIcon className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Invoice Summary</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900">${calculateSubtotal().toFixed(2)}</span>
                </div>

                {/* Discount */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Discount</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                      value={invoiceData.discountAmount}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, discountAmount: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tax Rate (%)</span>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                      value={invoiceData.taxRate}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tax Amount</span>
                  <span className="text-sm font-medium text-gray-900">${calculateTax().toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-blue-600">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                {invoiceData.isRecurring && (
                  <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CalendarIcon className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Recurring Billing</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      This invoice will be automatically generated {invoiceData.recurringInterval}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}