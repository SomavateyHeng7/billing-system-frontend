"use client";

import React, { useState } from 'react';
import { 
  Search, Plus, FileText, Clock, User, CreditCard, 
  Stethoscope, Calendar, AlertTriangle, CheckCircle,
  Phone, Mail, MapPin
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  phone: string;
  email?: string;
  address: string;
  patientId: string;
  insuranceNumber?: string;
  insuranceProvider?: string;
}

interface OPDService {
  id: string;
  name: string;
  department: string;
  doctor: string;
  price: number;
  duration: number; // in minutes
  description: string;
}

interface OPDBill {
  id: string;
  patient: Patient;
  services: (OPDService & { quantity: number })[];
  consultationFee: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  insuranceCoverage?: number;
  status: 'Draft' | 'Paid' | 'Insurance Pending' | 'Partial Payment';
  createdAt: string;
}

const OPDBilling: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [services, setServices] = useState<(OPDService & { quantity: number })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [consultationFee] = useState(50);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Mock data
  const mockPatients: Patient[] = [
    {
      id: 'P001',
      name: 'John Smith',
      age: 45,
      gender: 'Male',
      phone: '+1-555-0123',
      email: 'john.smith@email.com',
      address: '123 Main St, City, State 12345',
      patientId: 'PAT001',
      insuranceNumber: 'INS123456',
      insuranceProvider: 'Health Plus'
    },
    {
      id: 'P002',
      name: 'Maria Garcia',
      age: 32,
      gender: 'Female',
      phone: '+1-555-0124',
      address: '456 Oak Ave, City, State 12345',
      patientId: 'PAT002'
    }
  ];

  const mockServices: OPDService[] = [
    {
      id: 'S001',
      name: 'General Consultation',
      department: 'General Medicine',
      doctor: 'Dr. Smith',
      price: 100,
      duration: 30,
      description: 'General health consultation and examination'
    },
    {
      id: 'S002',
      name: 'Blood Test - Complete Blood Count',
      department: 'Laboratory',
      doctor: 'Lab Tech',
      price: 45,
      duration: 15,
      description: 'Complete blood count analysis'
    },
    {
      id: 'S003',
      name: 'X-Ray Chest',
      department: 'Radiology',
      doctor: 'Dr. Wilson',
      price: 150,
      duration: 20,
      description: 'Chest X-ray examination'
    },
    {
      id: 'S004',
      name: 'ECG',
      department: 'Cardiology',
      doctor: 'Dr. Johnson',
      price: 75,
      duration: 15,
      description: 'Electrocardiogram test'
    }
  ];

  const addService = (service: OPDService) => {
    const existingService = services.find(s => s.id === service.id);
    if (existingService) {
      setServices(services.map(s => 
        s.id === service.id 
          ? { ...s, quantity: s.quantity + 1 }
          : s
      ));
    } else {
      setServices([...services, { ...service, quantity: 1 }]);
    }
  };

  const removeService = (serviceId: string) => {
    setServices(services.filter(s => s.id !== serviceId));
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeService(serviceId);
    } else {
      setServices(services.map(s => 
        s.id === serviceId 
          ? { ...s, quantity }
          : s
      ));
    }
  };

  const calculateTotals = () => {
    const subtotal = services.reduce((sum, service) => sum + (service.price * service.quantity), 0) + consultationFee;
    const discountAmount = (subtotal * discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const tax = taxableAmount * 0.08; // 8% tax
    const total = taxableAmount + tax;
    
    return {
      subtotal,
      discountAmount,
      tax,
      total
    };
  };

  const { subtotal, discountAmount, tax, total } = calculateTotals();

  const handleGenerateBill = () => {
    if (!selectedPatient || services.length === 0) {
      alert('Please select a patient and add services');
      return;
    }

    const bill: OPDBill = {
      id: `OPD${Date.now()}`,
      patient: selectedPatient,
      services,
      consultationFee,
      subtotal,
      discount: discountAmount,
      tax,
      total,
      paymentMethod,
      status: paymentMethod === 'Insurance' ? 'Insurance Pending' : 'Paid',
      createdAt: new Date().toISOString()
    };

    console.log('Generated OPD Bill:', bill);
    alert('OPD Bill generated successfully!');
    
    // Reset form
    setSelectedPatient(null);
    setServices([]);
    setDiscount(0);
    setPaymentMethod('Cash');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">OPD Billing</h2>
        
        {/* Patient Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Patient Information</h3>
          
          {selectedPatient ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedPatient.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">ID: {selectedPatient.patientId}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedPatient.age} years, {selectedPatient.gender}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <Phone size={14} />
                      <span>{selectedPatient.phone}</span>
                    </div>
                    {selectedPatient.email && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mt-1">
                        <Mail size={14} />
                        <span>{selectedPatient.email}</span>
                      </div>
                    )}
                    {selectedPatient.insuranceProvider && (
                      <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Insurance: {selectedPatient.insuranceProvider}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Change Patient
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowPatientModal(true)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus size={16} />
                <span>New Patient</span>
              </button>
            </div>
          )}
          
          {/* Patient Search Results */}
          {!selectedPatient && searchTerm && (
            <div className="mt-4 border border-gray-200 dark:border-gray-600 rounded-lg max-h-60 overflow-y-auto">
              {mockPatients
                .filter(patient => 
                  patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(patient => (
                  <button
                    key={patient.id}
                    onClick={() => {
                      setSelectedPatient(patient);
                      setSearchTerm('');
                    }}
                    className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{patient.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">ID: {patient.patientId} | {patient.age}y, {patient.gender}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{patient.phone}</p>
                      </div>
                      {patient.insuranceProvider && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                          Insured
                        </span>
                      )}
                    </div>
                  </button>
                ))
              }
            </div>
          )}
        </div>

        {/* Services Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Services & Procedures</h3>
          
          {/* Available Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {mockServices.map(service => (
              <div key={service.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{service.name}</h4>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">${service.price}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{service.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span>{service.department} | Dr. {service.doctor}</span>
                  </div>
                  <button
                    onClick={() => addService(service)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Services */}
          {services.length > 0 && (
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-900 dark:text-white">Selected Services</h4>
              </div>
              <div className="p-4 space-y-3">
                {/* Consultation Fee */}
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Consultation Fee</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">General consultation</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">${consultationFee}</span>
                </div>
                
                {services.map(service => (
                  <div key={service.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 dark:text-white">{service.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{service.department}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(service.id, service.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{service.quantity}</span>
                        <button
                          onClick={() => updateQuantity(service.id, service.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                        >
                          +
                        </button>
                      </div>
                      <span className="w-20 text-right font-semibold text-gray-900 dark:text-white">
                        ${(service.price * service.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeService(service.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Billing Summary */}
        {(selectedPatient && services.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Details</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Insurance">Insurance</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bill Summary</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                  <span className="text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Discount ({discount}%):</span>
                    <span className="text-red-600 dark:text-red-400">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Tax (8%):</span>
                  <span className="text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-green-600 dark:text-green-400">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleGenerateBill}
                className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Generate OPD Bill
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OPDBilling;