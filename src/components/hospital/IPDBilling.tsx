"use client";

import React, { useState } from 'react';
import { 
  Search, Calendar, Bed, Clock, User, CreditCard,
  Activity, AlertTriangle, FileText, Plus, Minus
} from 'lucide-react';

interface IPDPatient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  patientId: string;
  admissionDate: string;
  dischargeDate?: string;
  ward: string;
  bedNumber: string;
  attendingDoctor: string;
  diagnosis: string;
  insuranceNumber?: string;
  insuranceProvider?: string;
  status: 'Active' | 'Discharged' | 'Pending Discharge';
}

interface IPDService {
  id: string;
  name: string;
  category: 'Room Charges' | 'Doctor Fees' | 'Nursing Charges' | 'Medicines' | 'Procedures' | 'Laboratory' | 'Other';
  price: number;
  unit: string;
  description: string;
}

interface IPDBillItem {
  service: IPDService;
  quantity: number;
  days?: number;
  date: string;
  total: number;
}

const IPDBilling: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<IPDPatient | null>(null);
  const [billItems, setBillItems] = useState<IPDBillItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Mock IPD patients
  const mockIPDPatients: IPDPatient[] = [
    {
      id: 'IPD001',
      name: 'Robert Johnson',
      age: 65,
      gender: 'Male',
      patientId: 'PAT001',
      admissionDate: '2025-11-10',
      ward: 'General Ward A',
      bedNumber: 'A-101',
      attendingDoctor: 'Dr. Smith',
      diagnosis: 'Pneumonia',
      insuranceNumber: 'INS789456',
      insuranceProvider: 'Medicare Plus',
      status: 'Active'
    },
    {
      id: 'IPD002',
      name: 'Sarah Davis',
      age: 35,
      gender: 'Female',
      patientId: 'PAT002',
      admissionDate: '2025-11-12',
      ward: 'Maternity Ward',
      bedNumber: 'M-205',
      attendingDoctor: 'Dr. Wilson',
      diagnosis: 'Normal Delivery',
      status: 'Pending Discharge'
    },
    {
      id: 'IPD003',
      name: 'Michael Brown',
      age: 42,
      gender: 'Male',
      patientId: 'PAT003',
      admissionDate: '2025-11-08',
      dischargeDate: '2025-11-15',
      ward: 'ICU',
      bedNumber: 'ICU-03',
      attendingDoctor: 'Dr. Johnson',
      diagnosis: 'Heart Attack',
      insuranceNumber: 'INS456789',
      insuranceProvider: 'Health Care',
      status: 'Discharged'
    }
  ];

  // Mock IPD services
  const mockIPDServices: IPDService[] = [
    {
      id: 'IPDS001',
      name: 'General Ward Bed',
      category: 'Room Charges',
      price: 200,
      unit: 'per day',
      description: 'General ward accommodation charges'
    },
    {
      id: 'IPDS002',
      name: 'ICU Bed',
      category: 'Room Charges',
      price: 800,
      unit: 'per day',
      description: 'Intensive care unit charges'
    },
    {
      id: 'IPDS003',
      name: 'Doctor Visit',
      category: 'Doctor Fees',
      price: 150,
      unit: 'per visit',
      description: 'Attending physician consultation'
    },
    {
      id: 'IPDS004',
      name: 'Nursing Care',
      category: 'Nursing Charges',
      price: 100,
      unit: 'per day',
      description: '24-hour nursing care'
    },
    {
      id: 'IPDS005',
      name: 'IV Antibiotics',
      category: 'Medicines',
      price: 85,
      unit: 'per dose',
      description: 'Intravenous antibiotic administration'
    },
    {
      id: 'IPDS006',
      name: 'Blood Test - Complete Panel',
      category: 'Laboratory',
      price: 120,
      unit: 'per test',
      description: 'Comprehensive blood work panel'
    },
    {
      id: 'IPDS007',
      name: 'CT Scan',
      category: 'Procedures',
      price: 600,
      unit: 'per scan',
      description: 'Computer tomography scan'
    },
    {
      id: 'IPDS008',
      name: 'ECG',
      category: 'Procedures',
      price: 75,
      unit: 'per test',
      description: 'Electrocardiogram'
    }
  ];

  const categories = ['All', 'Room Charges', 'Doctor Fees', 'Nursing Charges', 'Medicines', 'Procedures', 'Laboratory', 'Other'];

  const addBillItem = (service: IPDService) => {
    const newItem: IPDBillItem = {
      service,
      quantity: 1,
      days: service.category === 'Room Charges' || service.category === 'Nursing Charges' ? 1 : undefined,
      date: new Date().toISOString().split('T')[0],
      total: service.price
    };
    setBillItems([...billItems, newItem]);
  };

  const updateBillItem = (index: number, updates: Partial<IPDBillItem>) => {
    const updatedItems = [...billItems];
    const item = { ...updatedItems[index], ...updates };
    
    // Recalculate total
    const quantity = item.days || item.quantity;
    item.total = item.service.price * quantity;
    
    updatedItems[index] = item;
    setBillItems(updatedItems);
  };

  const removeBillItem = (index: number) => {
    setBillItems(billItems.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = billItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  const getDaysBetween = (admissionDate: string, dischargeDate?: string) => {
    const start = new Date(admissionDate);
    const end = dischargeDate ? new Date(dischargeDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const generateBill = () => {
    if (!selectedPatient || billItems.length === 0) {
      alert('Please select a patient and add services');
      return;
    }

    const bill = {
      id: `IPD${Date.now()}`,
      patient: selectedPatient,
      items: billItems,
      subtotal,
      tax,
      total,
      generatedAt: new Date().toISOString()
    };

    console.log('Generated IPD Bill:', bill);
    alert('IPD Bill generated successfully!');
  };

  const filteredServices = selectedCategory === 'All' 
    ? mockIPDServices 
    : mockIPDServices.filter(service => service.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">IPD Billing</h2>
        
        {/* Patient Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">IPD Patient Information</h3>
          
          {selectedPatient ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{selectedPatient.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">ID: {selectedPatient.patientId}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedPatient.age} years, {selectedPatient.gender}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <Bed size={14} />
                      <span>{selectedPatient.ward} - {selectedPatient.bedNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mt-1">
                      <User size={14} />
                      <span>{selectedPatient.attendingDoctor}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mt-1">
                      <FileText size={14} />
                      <span>{selectedPatient.diagnosis}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar size={14} />
                      <span>Admitted: {new Date(selectedPatient.admissionDate).toLocaleDateString()}</span>
                    </div>
                    {selectedPatient.dischargeDate && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mt-1">
                        <Calendar size={14} />
                        <span>Discharged: {new Date(selectedPatient.dischargeDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mt-1">
                      <Clock size={14} />
                      <span>Stay: {getDaysBetween(selectedPatient.admissionDate, selectedPatient.dischargeDate)} days</span>
                    </div>
                    
                    {selectedPatient.insuranceProvider && (
                      <div className="text-sm text-green-600 dark:text-green-400 mt-2">
                        Insurance: {selectedPatient.insuranceProvider}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedPatient.status === 'Active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                    selectedPatient.status === 'Pending Discharge' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}>
                    {selectedPatient.status}
                  </span>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Change Patient
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search IPD patients..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto">
                {mockIPDPatients
                  .filter(patient => 
                    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(patient => (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">{patient.name}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              patient.status === 'Active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                              patient.status === 'Pending Discharge' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                              'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                            }`}>
                              {patient.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            ID: {patient.patientId} | {patient.age}y, {patient.gender} | {patient.ward} - {patient.bedNumber}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {patient.attendingDoctor} | {patient.diagnosis}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Admitted: {new Date(patient.admissionDate).toLocaleDateString()} 
                            ({getDaysBetween(patient.admissionDate, patient.dischargeDate)} days)
                          </p>
                        </div>
                        {patient.insuranceProvider && (
                          <span className="ml-4 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                            Insured
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                }
              </div>
            </div>
          )}
        </div>

        {selectedPatient && (
          <>
            {/* Services Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">IPD Services & Charges</h3>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Available Services */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredServices.map(service => (
                  <div key={service.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{service.name}</h4>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${service.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs mr-2">
                          {service.category}
                        </span>
                        <span>{service.unit}</span>
                      </div>
                      <button
                        onClick={() => addBillItem(service)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Items */}
              {billItems.length > 0 && (
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                    <h4 className="font-medium text-gray-900 dark:text-white">Bill Items</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Unit Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {billItems.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-4 py-3">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{item.service.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{item.service.description}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs">
                                {item.service.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                              ${item.service.price}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    const quantity = item.days || item.quantity;
                                    if (quantity > 1) {
                                      updateBillItem(index, item.days ? { days: quantity - 1 } : { quantity: quantity - 1 });
                                    }
                                  }}
                                  className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-16 text-center font-medium text-gray-900 dark:text-white">
                                  {item.days || item.quantity} {item.days ? 'days' : item.service.unit.replace('per ', '')}
                                </span>
                                <button
                                  onClick={() => {
                                    const quantity = item.days || item.quantity;
                                    updateBillItem(index, item.days ? { days: quantity + 1 } : { quantity: quantity + 1 });
                                  }}
                                  className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="date"
                                value={item.date}
                                onChange={(e) => updateBillItem(index, { date: e.target.value })}
                                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                              />
                            </td>
                            <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">
                              ${item.total.toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => removeBillItem(index)}
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Bill Summary */}
            {billItems.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">IPD Bill Summary</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                      <span className="text-gray-900 dark:text-white font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Tax (8%):</span>
                      <span className="text-gray-900 dark:text-white font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span className="text-gray-900 dark:text-white">Total Amount:</span>
                        <span className="text-green-600 dark:text-green-400">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <button
                      onClick={generateBill}
                      className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Generate IPD Bill
                    </button>
                    
                    {selectedPatient.status === 'Active' && (
                      <button
                        onClick={() => {
                          // Handle discharge process
                          console.log('Initiating discharge process');
                          alert('Discharge process initiated');
                        }}
                        className="w-full mt-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Initiate Discharge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default IPDBilling;