'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  Calendar,
  DollarSign,
  BarChart3,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  Heart,
  Baby,
  Users,
  Stethoscope,
  Activity,
  Shield,
  Bone,
  AlertTriangle,
  TrendingUp,
  Clock,
  FileText,
  Download,
  Star
} from 'lucide-react';

// Enhanced interfaces for comprehensive package billing
interface Service {
  id: string;
  name: string;
  description?: string;
  category: string;
  provider?: string;
  duration?: string;
  included: boolean;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  patientId: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  expectedDeliveryDate?: string;
  insuranceNumber?: string;
  insuranceProvider?: string;
  insuranceCoverage?: number;
}

interface Package {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  discountedPrice?: number;
  duration: string;
  services: Service[];
  features: string[];
  icon?: string;
  popularityBadge?: string;
  isActive: boolean;
  validUntil?: string;
  termsAndConditions: string[];
}

interface Appointment {
  serviceId: string;
  serviceName: string;
  scheduledDate: string;
  scheduledTime: string;
  provider: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled';
}

interface PaymentDetails {
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentPlan: 'Full' | 'Installments' | 'Insurance';
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
}

interface PackageBill {
  baseAmount: number;
  discountAmount: number;
  insuranceAmount: number;
  patientAmount: number;
  additionalCharges: Array<{
    description: string;
    amount: number;
    type: 'service' | 'medication' | 'equipment' | 'other';
  }>;
}

interface PackageBooking {
  id: string;
  patient: Patient;
  package: Package;
  bookedDate: string;
  startDate: string;
  expectedEndDate: string;
  completedServices: string[];
  upcomingAppointments: Appointment[];
  status: 'Active' | 'Completed' | 'Partially Used' | 'Expired' | 'Cancelled';
  paymentDetails: PaymentDetails;
  billing: PackageBill;
  createdBy: string;
  lastUpdated: string;
}

const PackageBilling = () => {
  const [activeTab, setActiveTab] = useState('packages');
  const [selectedBooking, setSelectedBooking] = useState<PackageBooking | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data for comprehensive packages
  const mockPackages: Package[] = [
    {
      id: 'PKG001',
      code: 'MAT001',
      name: 'Complete Maternity Package',
      category: 'Maternity',
      description: 'Comprehensive maternity care from conception to 6 weeks postpartum, including all essential medical services, delivery, and postnatal care.',
      basePrice: 8500,
      discountedPrice: 6800,
      duration: '9 months + 6 weeks',
      popularityBadge: 'Most Chosen',
      isActive: true,
      validUntil: '2024-12-31',
      services: [
        { id: 'S001', name: 'Monthly Prenatal Checkups', category: 'Consultation', included: true },
        { id: 'S002', name: 'Ultrasound Scans (3D/4D)', category: 'Diagnostic', included: true },
        { id: 'S003', name: 'Labor & Delivery (Normal)', category: 'Delivery', included: true },
        { id: 'S004', name: 'C-Section (if required)', category: 'Surgical', included: true },
        { id: 'S005', name: 'Postpartum Care (6 weeks)', category: 'Follow-up', included: true },
        { id: 'S006', name: 'Newborn Care Package', category: 'Pediatric', included: true },
        { id: 'S007', name: 'Breastfeeding Support', category: 'Education', included: true },
        { id: 'S008', name: 'Emergency 24/7 Consultation', category: 'Emergency', included: true }
      ],
      features: [
        'Private room during delivery',
        '24/7 medical support',
        'Dedicated obstetrician',
        'Newborn photography session',
        'Nutritionist consultation',
        'Free ambulance service',
        'Complimentary gift hamper',
        'Postpartum depression counseling'
      ],
      termsAndConditions: [
        'Package valid for one pregnancy cycle',
        'Additional charges for extended stays',
        'Package non-transferable',
        'Refunds subject to terms and conditions'
      ]
    },
    {
      id: 'PKG002',
      code: 'CAR001',
      name: 'Cardiac Care Excellence',
      category: 'Cardiac',
      description: 'Comprehensive cardiac care package including diagnostics, treatment, and rehabilitation for heart conditions.',
      basePrice: 12000,
      discountedPrice: 9600,
      duration: '12 months',
      popularityBadge: 'Popular',
      isActive: true,
      validUntil: '2024-12-31',
      services: [
        { id: 'S011', name: 'Complete Cardiac Assessment', category: 'Diagnostic', included: true },
        { id: 'S012', name: 'ECG & Echo Monitoring', category: 'Monitoring', included: true },
        { id: 'S013', name: 'Stress Testing', category: 'Diagnostic', included: true },
        { id: 'S014', name: 'Angiography (if required)', category: 'Procedure', included: true },
        { id: 'S015', name: 'Cardiac Rehabilitation', category: 'Therapy', included: true },
        { id: 'S016', name: 'Nutrition Counseling', category: 'Education', included: true },
        { id: 'S017', name: 'Emergency Cardiac Care', category: 'Emergency', included: true }
      ],
      features: [
        'Leading cardiologist consultation',
        'State-of-the-art diagnostic equipment',
        'Personalized treatment plan',
        'Cardiac rehabilitation program',
        'Emergency response team',
        'Family education sessions'
      ],
      termsAndConditions: [
        'Valid for one year from booking',
        'Regular follow-ups included',
        'Emergency services 24/7',
        'Additional procedures charged separately'
      ]
    },
    {
      id: 'PKG003',
      code: 'HEA001',
      name: 'Executive Health Screening',
      category: 'Wellness',
      description: 'Comprehensive executive health checkup package for preventive healthcare and early disease detection.',
      basePrice: 2500,
      discountedPrice: 2000,
      duration: '1 day + follow-up',
      popularityBadge: 'New',
      isActive: true,
      validUntil: '2024-12-31',
      services: [
        { id: 'S021', name: 'Complete Blood Panel', category: 'Laboratory', included: true },
        { id: 'S022', name: 'Full Body Imaging (CT/MRI)', category: 'Imaging', included: true },
        { id: 'S023', name: 'Cardiac Assessment', category: 'Cardiac', included: true },
        { id: 'S024', name: 'Cancer Screening', category: 'Oncology', included: true },
        { id: 'S025', name: 'Vision & Hearing Tests', category: 'Sensory', included: true },
        { id: 'S026', name: 'Nutritionist Consultation', category: 'Wellness', included: true }
      ],
      features: [
        'Same-day results',
        'Comprehensive report',
        'Specialist consultations',
        'Personalized health plan',
        'Annual follow-up included',
        'VIP treatment facility'
      ],
      termsAndConditions: [
        'Fasting required for some tests',
        'Results available within 24 hours',
        'Follow-up consultation included',
        'Valid for 6 months'
      ]
    },
    {
      id: 'PKG004',
      code: 'ORT001',
      name: 'Orthopedic Surgery Package',
      category: 'Orthopedic',
      description: 'Complete orthopedic surgery package including pre-operative assessment, surgery, and post-operative rehabilitation.',
      basePrice: 25000,
      discountedPrice: 22500,
      duration: '6 months',
      isActive: true,
      validUntil: '2024-12-31',
      services: [
        { id: 'S031', name: 'Pre-operative Assessment', category: 'Assessment', included: true },
        { id: 'S032', name: 'Joint Replacement Surgery', category: 'Surgery', included: true },
        { id: 'S033', name: 'Post-operative Care', category: 'Recovery', included: true },
        { id: 'S034', name: 'Physical Therapy', category: 'Rehabilitation', included: true },
        { id: 'S035', name: 'Follow-up Consultations', category: 'Follow-up', included: true },
        { id: 'S036', name: 'Implant & Equipment', category: 'Equipment', included: true }
      ],
      features: [
        'Expert orthopedic surgeon',
        'Premium implants included',
        'Private recovery room',
        'Dedicated physiotherapist',
        '6-month rehabilitation',
        'Pain management program'
      ],
      termsAndConditions: [
        'Surgery date subject to scheduling',
        'Implant warranty included',
        'Rehabilitation mandatory',
        'Follow-up for 6 months'
      ]
    },
    {
      id: 'PKG005',
      code: 'DIA001',
      name: 'Diabetes Management Program',
      category: 'General Health',
      description: 'Comprehensive diabetes management package with continuous monitoring, education, and lifestyle modification support.',
      basePrice: 3500,
      discountedPrice: 2800,
      duration: '12 months',
      isActive: true,
      validUntil: '2024-12-31',
      services: [
        { id: 'S041', name: 'Continuous Glucose Monitoring', category: 'Monitoring', included: true },
        { id: 'S042', name: 'Endocrinologist Consultation', category: 'Specialist', included: true },
        { id: 'S043', name: 'Diabetes Education Classes', category: 'Education', included: true },
        { id: 'S044', name: 'Nutrition Counseling', category: 'Nutrition', included: true },
        { id: 'S045', name: 'Eye & Foot Examinations', category: 'Screening', included: true },
        { id: 'S046', name: 'Emergency Support', category: 'Emergency', included: true }
      ],
      features: [
        'Latest CGM technology',
        'Dedicated diabetes educator',
        'Mobile app monitoring',
        'Family education included',
        '24/7 emergency support',
        'Regular HbA1c tracking'
      ],
      termsAndConditions: [
        'Regular monitoring required',
        'CGM device included',
        'Monthly consultations',
        'Annual package renewal'
      ]
    },
    {
      id: 'PKG006',
      code: 'SEN001',
      name: 'Senior Wellness Package',
      category: 'Wellness',
      description: 'Comprehensive wellness package designed specifically for senior citizens with age-appropriate health screenings and care.',
      basePrice: 4500,
      discountedPrice: 3600,
      duration: '12 months',
      isActive: true,
      validUntil: '2024-12-31',
      services: [
        { id: 'S051', name: 'Geriatric Assessment', category: 'Assessment', included: true },
        { id: 'S052', name: 'Bone Density Screening', category: 'Screening', included: true },
        { id: 'S053', name: 'Memory & Cognitive Tests', category: 'Neurological', included: true },
        { id: 'S054', name: 'Fall Prevention Program', category: 'Safety', included: true },
        { id: 'S055', name: 'Medication Management', category: 'Pharmacy', included: true },
        { id: 'S056', name: 'Home Healthcare Services', category: 'Home Care', included: true }
      ],
      features: [
        'Geriatric specialist care',
        'Home visit services',
        'Medication delivery',
        'Emergency response system',
        'Family counseling',
        'Social worker support'
      ],
      termsAndConditions: [
        'Age 65+ eligibility',
        'Home visits included',
        'Emergency response 24/7',
        'Caregiver training included'
      ]
    }
  ];

  // Mock package bookings
  const mockBookings: PackageBooking[] = [
    {
      id: 'BOOK001',
      patient: {
        id: 'P001',
        name: 'Sarah Johnson',
        age: 28,
        gender: 'Female',
        patientId: 'PAT001',
        phone: '+1-555-0123',
        email: 'sarah.j@email.com',
        address: '123 Main St, City, State 12345',
        emergencyContact: {
          name: 'John Johnson',
          phone: '+1-555-0124',
          relationship: 'Husband'
        },
        expectedDeliveryDate: '2024-06-15',
        insuranceNumber: 'INS123456',
        insuranceProvider: 'Health Plus',
        insuranceCoverage: 80
      },
      package: mockPackages[0], // Maternity Package
      bookedDate: '2024-01-15',
      startDate: '2024-01-20',
      expectedEndDate: '2024-07-15',
      completedServices: ['S001', 'S002', 'S003'],
      upcomingAppointments: [
        {
          serviceId: 'S001',
          serviceName: 'Monthly Checkup',
          scheduledDate: '2024-04-20',
          scheduledTime: '10:00',
          provider: 'Dr. Smith',
          status: 'Confirmed'
        },
        {
          serviceId: 'S002',
          serviceName: 'Ultrasound Scan',
          scheduledDate: '2024-04-25',
          scheduledTime: '14:30',
          provider: 'Dr. Wilson',
          status: 'Scheduled'
        }
      ],
      status: 'Active',
      paymentDetails: {
        totalAmount: 6800,
        paidAmount: 3400,
        remainingAmount: 3400,
        paymentPlan: 'Installments',
        nextPaymentDate: '2024-04-01',
        nextPaymentAmount: 1700
      },
      billing: {
        baseAmount: 6800,
        discountAmount: 1700,
        insuranceAmount: 5440,
        patientAmount: 1360,
        additionalCharges: []
      },
      createdBy: 'Reception Staff',
      lastUpdated: '2024-03-15'
    },
    {
      id: 'BOOK002',
      patient: {
        id: 'P002',
        name: 'Robert Davis',
        age: 58,
        gender: 'Male',
        patientId: 'PAT002',
        phone: '+1-555-0125',
        email: 'robert.d@email.com',
        address: '456 Oak Ave, City, State 12345',
        emergencyContact: {
          name: 'Mary Davis',
          phone: '+1-555-0126',
          relationship: 'Wife'
        },
        insuranceNumber: 'INS789012',
        insuranceProvider: 'MedSecure',
        insuranceCoverage: 90
      },
      package: mockPackages[1], // Cardiac Care Package
      bookedDate: '2024-02-01',
      startDate: '2024-02-05',
      expectedEndDate: '2025-02-05',
      completedServices: ['S011', 'S012'],
      upcomingAppointments: [
        {
          serviceId: 'S013',
          serviceName: 'Stress Test',
          scheduledDate: '2024-04-10',
          scheduledTime: '09:00',
          provider: 'Dr. Martinez',
          status: 'Confirmed'
        }
      ],
      status: 'Active',
      paymentDetails: {
        totalAmount: 9600,
        paidAmount: 9600,
        remainingAmount: 0,
        paymentPlan: 'Full'
      },
      billing: {
        baseAmount: 9600,
        discountAmount: 2400,
        insuranceAmount: 8640,
        patientAmount: 960,
        additionalCharges: []
      },
      createdBy: 'Dr. Martinez',
      lastUpdated: '2024-03-14'
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
      'Active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Partially Used': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Expired': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      'Scheduled': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Confirmed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Paid': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Partial': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Pending': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Overdue': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  const getPopularityBadge = (popularity: string | null) => {
    if (!popularity) return null;
    
    const styles = {
      'Most Chosen': 'bg-green-100 text-green-800 border-green-200',
      'Popular': 'bg-blue-100 text-blue-800 border-blue-200',
      'New': 'bg-purple-100 text-purple-800 border-purple-200',
      'Limited Time': 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`px-2 py-1 rounded border text-xs font-medium ${styles[popularity as keyof typeof styles]}`}>
        {popularity}
      </span>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Maternity': Baby,
      'Cardiac': Heart,
      'Orthopedic': Bone,
      'General Health': Stethoscope,
      'Surgical': Activity,
      'Emergency': AlertTriangle,
      'Wellness': Heart,
      'Diagnostic': Eye
    };
    const Icon = icons[category as keyof typeof icons] || Package;
    return <Icon size={20} className="text-blue-600 dark:text-blue-400" />;
  };

  // Tab content components
  const PackagesView = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Package Catalog</h2>
          <p className="text-muted-foreground">Manage and view available medical packages</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          <Plus size={16} />
          Add New Package
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockPackages.map((pkg) => (
          <Card key={pkg.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(pkg.category)}
                  <div>
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{pkg.category}</p>
                  </div>
                </div>
                {pkg.popularityBadge && getPopularityBadge(pkg.popularityBadge)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{pkg.description}</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(pkg.discountedPrice || pkg.basePrice)}
                  </p>
                  {pkg.discountedPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      {formatCurrency(pkg.basePrice)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium">{pkg.duration}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-sm">Key Services:</p>
                <div className="text-sm text-muted-foreground">
                  {pkg.services.slice(0, 3).map((service, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <CheckCircle size={12} className="text-green-500" />
                      {service.name}
                    </div>
                  ))}
                  {pkg.services.length > 3 && (
                    <p className="text-xs">+{pkg.services.length - 3} more services</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
                  Book Package
                </button>
                <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                  <Eye size={16} />
                </button>
                <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                  <Edit size={16} />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const BookingsView = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Package Bookings</h2>
          <p className="text-muted-foreground">Track and manage patient package bookings</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          <Plus size={16} />
          New Booking
        </button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-3 font-medium">Patient</th>
                  <th className="text-left p-3 font-medium">Package</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Progress</th>
                  <th className="text-left p-3 font-medium">Payment</th>
                  <th className="text-left p-3 font-medium">Next Visit</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{booking.patient.name}</p>
                        <p className="text-sm text-muted-foreground">{booking.patient.patientId}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{booking.package.name}</p>
                        <p className="text-sm text-muted-foreground">{booking.package.category}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="p-3">
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(booking.completedServices.length / booking.package.services.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {booking.completedServices.length} of {booking.package.services.length} services
                      </p>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{formatCurrency(booking.paymentDetails.paidAmount)}</p>
                        <p className="text-sm text-muted-foreground">
                          of {formatCurrency(booking.paymentDetails.totalAmount)}
                        </p>
                        {booking.paymentDetails.remainingAmount > 0 && (
                          <p className="text-xs bg-yellow-100 text-yellow-900 px-2 py-1 rounded">
                            Due: {formatCurrency(booking.paymentDetails.remainingAmount)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      {booking.upcomingAppointments.length > 0 ? (
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(booking.upcomingAppointments[0].scheduledDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.upcomingAppointments[0].serviceName}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No upcoming visits</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded dark:hover:bg-blue-900">
                          <Eye size={14} />
                        </button>
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded dark:hover:bg-green-900">
                          <Edit size={14} />
                        </button>
                        <button className="p-1 text-purple-600 hover:bg-purple-50 rounded dark:hover:bg-purple-900">
                          <Calendar size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const BillingView = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Package Billing</h2>
          <p className="text-muted-foreground">Manage package payments and billing records</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          <DollarSign size={16} />
          Process Payment
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="text-green-600" size={20} />
              <div>
                <p className="text-2xl font-bold text-green-600">$189,400</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="text-orange-600" size={20} />
              <div>
                <p className="text-2xl font-bold text-orange-600">$12,300</p>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="text-blue-600" size={20} />
              <div>
                <p className="text-2xl font-bold text-blue-600">24</p>
                <p className="text-sm text-muted-foreground">Active Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-purple-600" size={20} />
              <div>
                <p className="text-2xl font-bold text-purple-600">18%</p>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Billing Activities</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-3 font-medium">Invoice ID</th>
                  <th className="text-left p-3 font-medium">Patient</th>
                  <th className="text-left p-3 font-medium">Package</th>
                  <th className="text-left p-3 font-medium">Amount</th>
                  <th className="text-left p-3 font-medium">Payment Status</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 font-mono text-sm">{booking.id}</td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{booking.patient.name}</p>
                        <p className="text-sm text-muted-foreground">{booking.patient.patientId}</p>
                      </div>
                    </td>
                    <td className="p-3">{booking.package.name}</td>
                    <td className="p-3 font-medium">{formatCurrency(booking.paymentDetails.totalAmount)}</td>
                    <td className="p-3">
                      {getStatusBadge(
                        booking.paymentDetails.remainingAmount === 0 
                          ? 'Paid' 
                          : booking.paymentDetails.paidAmount > 0 
                          ? 'Partial' 
                          : 'Pending'
                      )}
                    </td>
                    <td className="p-3 text-sm">{new Date(booking.bookedDate).toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded dark:hover:bg-blue-900">
                          <FileText size={14} />
                        </button>
                        <button className="p-1 text-green-600 hover:bg-green-50 rounded dark:hover:bg-green-900">
                          <DollarSign size={14} />
                        </button>
                        <button className="p-1 text-purple-600 hover:bg-purple-50 rounded dark:hover:bg-purple-900">
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AnalyticsView = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Package Analytics</h2>
          <p className="text-muted-foreground">Performance insights and trends for medical packages</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
          <BarChart3 size={16} />
          Export Report
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Most Popular</p>
                <p className="text-lg font-semibold">Maternity Package</p>
                <p className="text-sm text-green-600">67% bookings</p>
              </div>
              <Baby className="text-pink-500" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Highest Revenue</p>
                <p className="text-lg font-semibold">Cardiac Care</p>
                <p className="text-sm text-green-600">$86,400</p>
              </div>
              <Heart className="text-red-500" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-lg font-semibold">94.5%</p>
                <p className="text-sm text-green-600">+2.3% from last month</p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Patient Satisfaction</p>
                <p className="text-lg font-semibold">4.8/5</p>
                <p className="text-sm text-green-600">Excellent rating</p>
              </div>
              <Star className="text-yellow-500" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Package Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPackages.map((pkg, index) => (
                <div key={pkg.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(pkg.category)}
                    <div>
                      <p className="font-medium">{pkg.name}</p>
                      <p className="text-sm text-muted-foreground">{pkg.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{Math.floor(Math.random() * 20) + 5} bookings</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency((pkg.discountedPrice || pkg.basePrice) * (Math.floor(Math.random() * 20) + 5))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">January</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm font-medium">$45,200</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">February</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium">$52,800</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">March</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <span className="text-sm font-medium">$58,400</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">April</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-green-600">$62,100</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Package Billing Management</h1>
          <p className="text-muted-foreground">
            Comprehensive medical package billing system for maternity and specialized care bundles
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          <Package size={16} />
          Quick Book
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'packages', label: 'Packages', icon: Package },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'billing', label: 'Billing', icon: DollarSign },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'packages' && <PackagesView />}
        {activeTab === 'bookings' && <BookingsView />}
        {activeTab === 'billing' && <BillingView />}
        {activeTab === 'analytics' && <AnalyticsView />}
      </div>
    </div>
  );
};

export default PackageBilling;