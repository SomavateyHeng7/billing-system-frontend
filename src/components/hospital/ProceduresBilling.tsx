"use client";

import React, { useState } from 'react';
import { 
  Search, Calendar, Clock, User, CreditCard, Stethoscope,
  AlertTriangle, FileText, Plus, Filter, CheckCircle, 
  XCircle, Eye, Edit, Download, DollarSign, Activity,
  UserCheck, Shield, Scissors, Heart, Brain, Zap
} from 'lucide-react';

interface Procedure {
  id: string;
  name: string;
  code: string;
  department: string;
  category: 'Diagnostic' | 'Therapeutic' | 'Surgical' | 'Emergency';
  price: number;
  duration: number; // in minutes
  anesthesiaRequired: boolean;
  anesthesiaFee?: number;
  facilityFee: number;
  professionalFee: number;
  equipmentFee: number;
  supplies: string[];
  supplyCost: number;
  description: string;
  prerequisites?: string[];
  complications?: string[];
  recoveryTime: number; // in hours
  riskLevel: 'Low' | 'Medium' | 'High';
}

interface ProcedureBooking {
  id: string;
  patient: {
    id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female';
    patientId: string;
    phone: string;
    insuranceNumber?: string;
    insuranceProvider?: string;
    insuranceCoverage?: number; // percentage
  };
  procedure: Procedure;
  scheduledDate: string;
  scheduledTime: string;
  doctor: string;
  anesthesiologist?: string;
  assistants?: string[];
  operatingRoom?: string;
  status: 'Scheduled' | 'Pre-Op' | 'In Progress' | 'Completed' | 'Cancelled' | 'Post-Op';
  notes?: string;
  complications?: string;
  actualDuration?: number;
  actualStartTime?: string;
  actualEndTime?: string;
  preOpChecklist: boolean;
  postOpInstructions?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  billing?: {
    baseAmount: number;
    additionalCharges: number;
    totalAmount: number;
    insuranceAmount: number;
    patientAmount: number;
    paymentStatus: 'Pending' | 'Partial' | 'Paid';
    paymentMethod?: string;
    discount: number;
  };
}

interface ProcedureBill {
  id: string;
  booking: ProcedureBooking;
  procedureFee: number;
  anesthesiaFee: number;
  facilityFee: number;
  equipmentFee: number;
  supplyCost: number;
  additionalCharges: Array<{
    description: string;
    amount: number;
    category: string;
  }>;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  insuranceCoverage: number;
  insuranceAmount: number;
  patientAmount: number;
  paymentMethod: string;
  status: 'Draft' | 'Submitted' | 'Insurance Pending' | 'Paid' | 'Partial Payment';
  createdAt: string;
  createdBy: string;
}

const ProceduresBilling = () => {
  const [selectedTab, setSelectedTab] = useState<'schedule' | 'billing' | 'analytics'>('schedule');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBooking, setSelectedBooking] = useState<ProcedureBooking | null>(null);
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<ProcedureBill | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Procedures Management</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedTab('schedule')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTab === 'schedule'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Schedule & Track
            </button>
            <button
              onClick={() => setSelectedTab('billing')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTab === 'billing'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Billing & Analytics
            </button>
            <button
              onClick={() => setSelectedTab('analytics')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTab === 'analytics'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Reports
            </button>
          </div>
        </div>

        {/* Content based on selected tab */}
        {selectedTab === 'schedule' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Procedure Scheduling</h3>
            <p className="text-gray-600 dark:text-gray-300">Schedule and track procedures coming soon...</p>
          </div>
        )}

        {selectedTab === 'billing' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Procedure Billing</h3>
            <p className="text-gray-600 dark:text-gray-300">Billing functionality coming soon...</p>
          </div>
        )}

        {selectedTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Procedure Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300">Analytics dashboard coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );

  // Mock procedures
  const mockProcedures: Procedure[] = [
    {
      id: 'PROC001',
      name: 'Appendectomy',
      code: 'APP-001',
      department: 'General Surgery',
      category: 'Surgical',
      price: 8500,
      duration: 120,
      anesthesiaRequired: true,
      anesthesiaFee: 1500,
      facilityFee: 2000,
      professionalFee: 4000,
      equipmentFee: 800,
      supplies: ['Surgical Kit', 'Sutures', 'Antibiotics'],
      supplyCost: 200,
      description: 'Surgical removal of the appendix',
      prerequisites: ['Blood Test', 'ECG', 'Anesthesia Consultation'],
      complications: ['Bleeding', 'Infection', 'Adhesions'],
      recoveryTime: 24,
      riskLevel: 'Medium'
    },
    {
      id: 'PROC002',
      name: 'Colonoscopy',
      code: 'COL-001',
      department: 'Gastroenterology',
      category: 'Diagnostic',
      price: 1200,
      duration: 45,
      anesthesiaRequired: true,
      anesthesiaFee: 300,
      facilityFee: 400,
      professionalFee: 400,
      equipmentFee: 100,
      supplies: ['Colonoscope', 'Biopsy Kit'],
      supplyCost: 50,
      description: 'Diagnostic examination of the colon',
      prerequisites: ['Bowel Preparation', 'Consent Form'],
      recoveryTime: 4,
      riskLevel: 'Low'
    },
    {
      id: 'PROC003',
      name: 'MRI Brain',
      code: 'MRI-001',
      department: 'Radiology',
      category: 'Diagnostic',
      price: 2800,
      duration: 60,
      anesthesiaRequired: false,
      anesthesiaFee: 0,
      facilityFee: 1200,
      professionalFee: 800,
      equipmentFee: 700,
      supplies: ['Contrast Dye', 'IV Kit'],
      supplyCost: 100,
      description: 'Magnetic resonance imaging of the brain',
      recoveryTime: 1,
      riskLevel: 'Low'
    },
    {
      id: 'PROC004',
      name: 'Cardiac Catheterization',
      code: 'CATH-001',
      department: 'Cardiology',
      category: 'Therapeutic',
      price: 15000,
      duration: 90,
      anesthesiaRequired: true,
      anesthesiaFee: 2000,
      facilityFee: 5000,
      professionalFee: 6000,
      equipmentFee: 1500,
      supplies: ['Catheter', 'Stent', 'Contrast Dye'],
      supplyCost: 500,
      description: 'Minimally invasive cardiac procedure',
      prerequisites: ['Blood Test', 'ECG', 'Echocardiogram', 'Consent Form'],
      complications: ['Bleeding', 'Arrhythmia', 'Vessel Damage'],
      recoveryTime: 8,
      riskLevel: 'High'
    },
    {
      id: 'PROC005',
      name: 'Emergency Chest Tube',
      code: 'EMRG-001',
      department: 'Emergency Medicine',
      category: 'Emergency',
      price: 3500,
      duration: 30,
      anesthesiaRequired: true,
      anesthesiaFee: 500,
      facilityFee: 1000,
      professionalFee: 1500,
      equipmentFee: 400,
      supplies: ['Chest Tube', 'Drainage Kit', 'Local Anesthetic'],
      supplyCost: 100,
      description: 'Emergency chest tube insertion',
      recoveryTime: 12,
      riskLevel: 'High'
    },
    {
      id: 'PROC006',
      name: 'Arthroscopic Knee Surgery',
      code: 'ORTH-001',
      department: 'Orthopedics',
      category: 'Surgical',
      price: 12000,
      duration: 150,
      anesthesiaRequired: true,
      anesthesiaFee: 1800,
      facilityFee: 3000,
      professionalFee: 5500,
      equipmentFee: 1200,
      supplies: ['Arthroscope', 'Surgical Kit', 'Implants'],
      supplyCost: 500,
      description: 'Minimally invasive knee joint surgery',
      prerequisites: ['MRI', 'Blood Test', 'Physical Therapy Assessment'],
      complications: ['Infection', 'Stiffness', 'Nerve Damage'],
      recoveryTime: 48,
      riskLevel: 'Medium'
    }
  ];

  // Mock bookings
  const mockBookings: ProcedureBooking[] = [
    {
      id: 'BOOK001',
      patient: {
        id: 'P001',
        name: 'John Smith',
        age: 45,
        gender: 'Male',
        patientId: 'PAT001',
        phone: '+1-555-0123',
        insuranceNumber: 'INS123456',
        insuranceProvider: 'Health Plus',
        insuranceCoverage: 80
      },
      procedure: mockProcedures[0],
      scheduledDate: '2024-03-20',
      scheduledTime: '09:00',
      doctor: 'Dr. Johnson',
      anesthesiologist: 'Dr. Williams',
      assistants: ['Nurse Sarah', 'Tech Mike'],
      operatingRoom: 'OR-1',
      status: 'Scheduled',
      preOpChecklist: false,
      followUpRequired: true,
      followUpDate: '2024-03-27',
      billing: {
        baseAmount: 8500,
        additionalCharges: 0,
        totalAmount: 8500,
        insuranceAmount: 6800,
        patientAmount: 1700,
        paymentStatus: 'Pending',
        discount: 0
      }
    },
    {
      id: 'BOOK002',
      patient: {
        id: 'P002',
        name: 'Maria Garcia',
        age: 38,
        gender: 'Female',
        patientId: 'PAT002',
        phone: '+1-555-0124',
        insuranceNumber: 'INS789012',
        insuranceProvider: 'MedSecure',
        insuranceCoverage: 70
      },
      procedure: mockProcedures[1],
      scheduledDate: '2024-03-18',
      scheduledTime: '14:30',
      doctor: 'Dr. Davis',
      anesthesiologist: 'Dr. Wilson',
      status: 'Completed',
      actualDuration: 50,
      actualStartTime: '14:35',
      actualEndTime: '15:25',
      preOpChecklist: true,
      followUpRequired: true,
      followUpDate: '2024-03-25',
      postOpInstructions: 'Rest for 24 hours, clear liquids only',
      billing: {
        baseAmount: 1200,
        additionalCharges: 100,
        totalAmount: 1300,
        insuranceAmount: 910,
        patientAmount: 390,
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        discount: 0
      }
    },
    {
      id: 'BOOK003',
      patient: {
        id: 'P003',
        name: 'David Chen',
        age: 62,
        gender: 'Male',
        patientId: 'PAT003',
        phone: '+1-555-0125',
        insuranceNumber: 'INS345678',
        insuranceProvider: 'Global Health',
        insuranceCoverage: 90
      },
      procedure: mockProcedures[3],
      scheduledDate: '2024-03-19',
      scheduledTime: '08:00',
      doctor: 'Dr. Martinez',
      anesthesiologist: 'Dr. Brown',
      assistants: ['Nurse Lisa', 'Tech Tom', 'Perfusionist'],
      operatingRoom: 'Cath Lab 1',
      status: 'In Progress',
      preOpChecklist: true,
      followUpRequired: true,
      billing: {
        baseAmount: 15000,
        additionalCharges: 500,
        totalAmount: 15500,
        insuranceAmount: 13950,
        patientAmount: 1550,
        paymentStatus: 'Pending',
        discount: 0
      }
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'Scheduled': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Pre-Op': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'In Progress': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Post-Op': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Draft': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      'Submitted': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Insurance Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Partial Payment': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  const getRiskLevelColor = (risk: string) => {
    const colors = {
      'Low': 'text-green-600',
      'Medium': 'text-yellow-600',
      'High': 'text-red-600'
    };
    return colors[risk as keyof typeof colors] || 'text-gray-600';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Diagnostic': Brain,
      'Therapeutic': Heart,
      'Surgical': Scissors,
      'Emergency': Zap
    };
    const Icon = icons[category as keyof typeof icons] || Stethoscope;
    return <Icon size={16} />;
  };

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = 
      booking.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.procedure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || booking.procedure.category === selectedCategory;
    const matchesDate = booking.scheduledDate === selectedDate;
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const ScheduleView = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Procedure Schedule</h3>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search procedures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="All">All Categories</option>
              <option value="Diagnostic">Diagnostic</option>
              <option value="Therapeutic">Therapeutic</option>
              <option value="Surgical">Surgical</option>
              <option value="Emergency">Emergency</option>
            </select>
            <button
              onClick={() => setShowNewBookingModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Schedule Procedure</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  booking.procedure.category === 'Surgical' ? 'bg-red-100 dark:bg-red-900' :
                  booking.procedure.category === 'Diagnostic' ? 'bg-blue-100 dark:bg-blue-900' :
                  booking.procedure.category === 'Therapeutic' ? 'bg-green-100 dark:bg-green-900' :
                  'bg-orange-100 dark:bg-orange-900'
                }`}>
                  {getCategoryIcon(booking.procedure.category)}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {booking.procedure.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {booking.procedure.code} • {booking.procedure.department}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusBadge(booking.status)}
                <span className={`text-sm font-medium ${getRiskLevelColor(booking.procedure.riskLevel)}`}>
                  {booking.procedure.riskLevel} Risk
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h5 className="font-medium text-gray-900 dark:text-white">Patient Information</h5>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p><span className="font-medium">Name:</span> {booking.patient.name}</p>
                  <p><span className="font-medium">ID:</span> {booking.patient.patientId}</p>
                  <p><span className="font-medium">Age:</span> {booking.patient.age} • {booking.patient.gender}</p>
                  <p><span className="font-medium">Phone:</span> {booking.patient.phone}</p>
                  {booking.patient.insuranceProvider && (
                    <p><span className="font-medium">Insurance:</span> {booking.patient.insuranceProvider} ({booking.patient.insuranceCoverage}%)</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-medium text-gray-900 dark:text-white">Procedure Details</h5>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p><span className="font-medium">Date:</span> {new Date(booking.scheduledDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Time:</span> {booking.scheduledTime}</p>
                  <p><span className="font-medium">Duration:</span> {booking.procedure.duration} minutes</p>
                  <p><span className="font-medium">Doctor:</span> {booking.doctor}</p>
                  {booking.anesthesiologist && (
                    <p><span className="font-medium">Anesthesiologist:</span> {booking.anesthesiologist}</p>
                  )}
                  {booking.operatingRoom && (
                    <p><span className="font-medium">Location:</span> {booking.operatingRoom}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-medium text-gray-900 dark:text-white">Billing Information</h5>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p><span className="font-medium">Base Amount:</span> {formatCurrency(booking.billing?.baseAmount || 0)}</p>
                  {(booking.billing?.additionalCharges || 0) > 0 && (
                    <p><span className="font-medium">Additional:</span> {formatCurrency(booking.billing?.additionalCharges || 0)}</p>
                  )}
                  <p><span className="font-medium">Total:</span> <span className="font-bold">{formatCurrency(booking.billing?.totalAmount || 0)}</span></p>
                  <p><span className="font-medium">Insurance:</span> {formatCurrency(booking.billing?.insuranceAmount || 0)}</p>
                  <p><span className="font-medium">Patient Pays:</span> <span className="font-semibold text-red-600">{formatCurrency(booking.billing?.patientAmount || 0)}</span></p>
                  <div className="mt-2">{getStatusBadge(booking.billing?.paymentStatus || 'Pending')}</div>
                </div>
              </div>
            </div>

            {booking.status === 'Completed' && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-600 dark:text-green-400" size={16} />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">Procedure Completed</span>
                </div>
                {booking.actualDuration && (
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Actual duration: {booking.actualDuration} minutes 
                    ({booking.actualStartTime} - {booking.actualEndTime})
                  </p>
                )}
                {booking.postOpInstructions && (
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Post-op instructions: {booking.postOpInstructions}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setSelectedBooking(booking)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2"
              >
                <Eye size={16} />
              </button>
              <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-2">
                <Edit size={16} />
              </button>
              <button 
                onClick={() => {
                  setSelectedBooking(booking);
                  setShowBillModal(true);
                }}
                className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 p-2"
              >
                <CreditCard size={16} />
              </button>
              <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 p-2">
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Mock procedure data continued
  const additionalProcedures = [
    {
      id: 'PROC025',
      name: 'Chest Tube Insertion',
      code: 'ECT-001',
      department: 'Emergency Medicine',
      category: 'Emergency',
      price: 3500,
      duration: 30,
      anesthesiaRequired: false,
      description: 'Emergency chest tube insertion'
    }
  ];

  const categories = ['All', 'Diagnostic', 'Therapeutic', 'Surgical', 'Emergency'];

  const filteredProcedures = mockProcedures.filter(procedure => {
    const matchesSearch = procedure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         procedure.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || procedure.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const generateProcedureBill = (booking: ProcedureBooking) => {
    const additionalCharges = booking.procedure.anesthesiaRequired ? 500 : 0;
    const subtotal = booking.procedure.price + additionalCharges;
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const bill = {
      id: `PROCBILL${Date.now()}`,
      booking,
      charges: {
        procedureCharge: booking.procedure.price,
        anesthesiaCharge: additionalCharges,
        subtotal,
        tax,
        total
      },
      generatedAt: new Date().toISOString()
    };

    console.log('Generated Procedure Bill:', bill);
    alert(`Bill generated for ${booking.procedure.name} - Total: $${total.toFixed(2)}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Procedures Management</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedTab('schedule')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTab === 'schedule'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Schedule & Track
            </button>
            <button
              onClick={() => setSelectedTab('billing')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTab === 'billing'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Billing
            </button>
          </div>
        </div>

        {selectedTab === 'schedule' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search procedures..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Available Procedures */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Procedures</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProcedures.map(procedure => (
                  <div key={procedure.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{procedure.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Code: {procedure.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">${procedure.price}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          procedure.category === 'Emergency' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                          procedure.category === 'Surgical' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                          procedure.category === 'Therapeutic' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                          'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        }`}>
                          {procedure.category}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{procedure.description}</p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span>{procedure.department}</span>
                      <span>{procedure.duration} minutes</span>
                    </div>
                    
                    {procedure.anesthesiaRequired && (
                      <div className="flex items-center text-sm text-orange-600 dark:text-orange-400 mb-3">
                        <AlertTriangle size={14} className="mr-1" />
                        <span>Anesthesia Required</span>
                      </div>
                    )}
                    
                    {procedure.prerequisites && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Prerequisites:</p>
                        <div className="flex flex-wrap gap-1">
                          {procedure.prerequisites.map((req, index) => (
                            <span key={index} className="inline-block px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                      Schedule Procedure
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Scheduled Procedures */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Procedures for {new Date(selectedDate).toLocaleDateString()}
              </h3>
              
              {filteredBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Stethoscope size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No procedures scheduled for this date</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map(booking => (
                    <div key={booking.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white text-lg">
                              {booking.procedure.name}
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              booking.status === 'Completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                              booking.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                              booking.status === 'Cancelled' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                              'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <strong>Patient:</strong> {booking.patient.name} (ID: {booking.patient.patientId})
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <strong>Time:</strong> {booking.scheduledTime}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <strong>Doctor:</strong> {booking.doctor}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <strong>Department:</strong> {booking.procedure.department}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <strong>Duration:</strong> {booking.procedure.duration} minutes
                              </p>
                              {booking.anesthesiologist && (
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  <strong>Anesthesiologist:</strong> {booking.anesthesiologist}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {booking.patient.insuranceProvider && (
                            <div className="mt-2">
                              <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded">
                                Insurance: {booking.patient.insuranceProvider}
                              </span>
                            </div>
                          )}
                          
                          {booking.notes && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>Notes:</strong> {booking.notes}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4 text-right">
                          <p className="text-xl font-bold text-green-600 dark:text-green-400">
                            ${booking.procedure.price}
                          </p>
                          {booking.procedure.anesthesiaRequired && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              + $500 (Anesthesia)
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        {booking.status === 'Completed' && (
                          <button
                            onClick={() => generateProcedureBill(booking)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                          >
                            Generate Bill
                          </button>
                        )}
                        {booking.status === 'Scheduled' && (
                          <>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                              Start Procedure
                            </button>
                            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors">
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === 'billing' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Procedure Billing Summary</h3>
            
            {/* Billing Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Today's Procedures</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">8</p>
                  </div>
                  <Stethoscope className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Revenue Today</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-300">$24,500</p>
                  </div>
                  <CreditCard className="text-green-600 dark:text-green-400" size={24} />
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending Bills</p>
                    <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">3</p>
                  </div>
                  <Clock className="text-yellow-600 dark:text-yellow-400" size={24} />
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Insurance Claims</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">$18,200</p>
                  </div>
                  <FileText className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
              </div>
            </div>
            
            {/* Recent Procedure Bills */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Recent Procedure Bills</h4>
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Procedure
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {mockBookings.map(booking => {
                        const additionalCharges = booking.procedure.anesthesiaRequired ? 500 : 0;
                        const total = booking.procedure.price + additionalCharges;
                        
                        return (
                          <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-4 py-3">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {booking.procedure.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {booking.procedure.code} | {booking.procedure.department}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {booking.patient.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {booking.patient.patientId}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                              {new Date(booking.scheduledDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-semibold text-green-600 dark:text-green-400">
                                ${total.toFixed(2)}
                              </div>
                              {booking.procedure.anesthesiaRequired && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Incl. Anesthesia
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.status === 'Completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                                booking.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                                'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                              }`}>
                                {booking.status === 'Completed' ? 'Billed' : booking.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                                  View
                                </button>
                                {booking.status === 'Completed' && (
                                  <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                                    Receipt
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProceduresBilling;