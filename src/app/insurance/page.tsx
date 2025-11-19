'use client';

import { useState } from 'react';
import { 
  Shield,
  Plus,
  Search,
  Filter,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  Edit,
  Send,
  DollarSign,
  Calendar,
  User,
  Building,
  Phone,
  Mail
} from 'lucide-react';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/shared/header';
import Footer from '@/components/shared/footer';

// TypeScript interfaces
interface InsuranceClaim {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  serviceDate: string;
  submissionDate: string;
  claimAmount: number;
  approvedAmount: number;
  status: 'approved' | 'pending' | 'denied' | 'processing';
  insuranceProvider: string;
  policyNumber: string;
  diagnosis: string;
  procedureCodes: string[];
  notes: string;
  processingTime: number;
  denialReason?: string;
}

interface InsuranceProvider {
  id: string;
  name: string;
  type: 'PPO' | 'HMO' | 'EPO' | 'POS';
  contactPhone: string;
  contactEmail: string;
  websitePortal: string;
  averageProcessingTime: number;
  approvalRate: number;
}

type ClaimStatus = 'approved' | 'pending' | 'denied' | 'processing';

// Mock data for insurance claims
const mockClaims: InsuranceClaim[] = [
  {
    id: 'CLM-2024-001',
    patientId: 'P-1001',
    patientName: 'John Smith',
    patientPhone: '(555) 123-4567',
    serviceDate: '2024-11-05',
    submissionDate: '2024-11-06',
    claimAmount: 1250.50,
    approvedAmount: 1125.45,
    status: 'approved',
    insuranceProvider: 'Blue Cross Blue Shield',
    policyNumber: 'BC123456789',
    diagnosis: 'Hypertension follow-up',
    procedureCodes: ['99213', '90801'],
    notes: 'Routine follow-up appointment',
    processingTime: 3
  },
  {
    id: 'CLM-2024-002',
    patientId: 'P-1002',
    patientName: 'Sarah Johnson',
    patientPhone: '(555) 987-6543',
    serviceDate: '2024-11-03',
    submissionDate: '2024-11-04',
    claimAmount: 890.00,
    approvedAmount: 0,
    status: 'pending',
    insuranceProvider: 'Aetna Healthcare',
    policyNumber: 'AE987654321',
    diagnosis: 'Annual physical examination',
    procedureCodes: ['99395'],
    notes: 'Preventive care visit',
    processingTime: 7
  },
  {
    id: 'CLM-2024-003',
    patientId: 'P-1003',
    patientName: 'Michael Brown',
    patientPhone: '(555) 456-7890',
    serviceDate: '2024-10-28',
    submissionDate: '2024-10-29',
    claimAmount: 2100.00,
    approvedAmount: 0,
    status: 'denied',
    insuranceProvider: 'Humana',
    policyNumber: 'HU456789123',
    diagnosis: 'Emergency room visit',
    procedureCodes: ['99284', '71020'],
    notes: 'Chest pain evaluation',
    processingTime: 5,
    denialReason: 'Prior authorization required'
  }
];

// Mock insurance providers
const mockProviders: InsuranceProvider[] = [
  {
    id: '1',
    name: 'Blue Cross Blue Shield',
    type: 'PPO',
    contactPhone: '1-800-555-0123',
    contactEmail: 'claims@bcbs.com',
    websitePortal: 'https://provider.bcbs.com',
    averageProcessingTime: 5,
    approvalRate: 94.2
  },
  {
    id: '2',
    name: 'Aetna Healthcare',
    type: 'HMO',
    contactPhone: '1-800-555-0456',
    contactEmail: 'provider@aetna.com',
    websitePortal: 'https://www.aetna.com/providers',
    averageProcessingTime: 7,
    approvalRate: 91.8
  },
  {
    id: '3',
    name: 'Humana',
    type: 'PPO',
    contactPhone: '1-800-555-0789',
    contactEmail: 'claims@humana.com',
    websitePortal: 'https://provider.humana.com',
    averageProcessingTime: 6,
    approvalRate: 89.5
  }
];

export default function InsurancePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(null);
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);

  const getStatusColor = (status: ClaimStatus): string => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ClaimStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'denied':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredClaims = mockClaims.filter(claim => {
    const matchesSearch = 
      claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.insuranceProvider.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalClaims = mockClaims.length;
  const approvedClaims = mockClaims.filter(c => c.status === 'approved').length;
  const pendingClaims = mockClaims.filter(c => c.status === 'pending').length;
  const deniedClaims = mockClaims.filter(c => c.status === 'denied').length;
  const totalClaimAmount = mockClaims.reduce((sum, claim) => sum + claim.claimAmount, 0);
  const approvedAmount = mockClaims.reduce((sum, claim) => sum + (claim.approvedAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <Header sidebarCollapsed={sidebarCollapsed} />
      <div className={`transition-all duration-300 p-3 sm:p-4 md:p-6 pt-16 sm:pt-18 md:pt-20 ${
        sidebarCollapsed ? 'ml-0 sm:ml-14' : 'ml-0 sm:ml-56'
      }`}>
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
            Insurance Claims Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 sm:mt-2">
            Manage insurance claims, track submissions, and monitor approvals efficiently
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowNewClaimModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Submit New Claim</span>
          </button>
          <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-lg mb-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {['overview', 'claims', 'providers', 'reports'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Claims</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalClaims}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-green-600 dark:text-green-400">↗ +5</span>
                      <span className="ml-1">this week</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved Claims</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvedClaims}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-green-600 dark:text-green-400">{Math.round((approvedClaims / totalClaims) * 100)}%</span>
                      <span className="ml-1">approval rate</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                      <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Claims</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingClaims}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-yellow-600 dark:text-yellow-400">Avg 6 days</span>
                      <span className="ml-1">processing</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved Amount</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">${approvedAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-green-600 dark:text-green-400">${totalClaimAmount.toLocaleString()}</span>
                      <span className="ml-1">total claimed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Claims Activity</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {mockClaims.slice(0, 3).map((claim) => (
                      <div key={claim.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex-shrink-0">
                          {getStatusIcon(claim.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{claim.patientName}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{claim.id} • {claim.insuranceProvider}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">${claim.claimAmount.toLocaleString()}</p>
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(claim.status)}`}>
                                {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'claims' && (
            <div>
              {/* Search and Filters */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search by patient name, claim ID, or insurance provider..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <select
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="denied">Denied</option>
                        <option value="processing">Processing</option>
                      </select>
                      <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Claims Table */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Insurance Claims ({filteredClaims.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Patient / Claim ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Insurance Provider
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Service Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Claim Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Processing Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredClaims.map((claim) => (
                        <tr key={claim.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{claim.patientName}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{claim.id}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{claim.insuranceProvider}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{claim.policyNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(claim.serviceDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">${claim.claimAmount.toLocaleString()}</div>
                            {claim.approvedAmount > 0 && (
                              <div className="text-sm text-green-600 dark:text-green-400">${claim.approvedAmount.toLocaleString()} approved</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(claim.status)}`}>
                              {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {claim.processingTime} days
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setSelectedClaim(claim)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300" title="Edit Claim">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300" title="Resubmit">
                                <Send className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'providers' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProviders.map((provider) => (
                  <div key={provider.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{provider.name}</h3>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                        {provider.type}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <span className="text-sm text-gray-900 dark:text-white">{provider.contactPhone}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <span className="text-sm text-gray-900 dark:text-white">{provider.contactEmail}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Avg Processing</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{provider.averageProcessingTime} days</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Approval Rate</p>
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">{provider.approvalRate}%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <a
                        href={provider.websitePortal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 py-2 px-4 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors text-sm font-medium text-center block"
                      >
                        Provider Portal
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Claims Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Approval Rates by Provider</h4>
                  {mockProviders.map((provider) => (
                    <div key={provider.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{provider.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${provider.approvalRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{provider.approvalRate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Processing Times</h4>
                  {mockProviders.map((provider) => (
                    <div key={provider.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{provider.name}</span>
                      <span className="text-sm font-medium text-gray-900">{provider.averageProcessingTime} days</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Claim Details Modal */}
        {selectedClaim && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Claim Details</h3>
                  <button
                    onClick={() => setSelectedClaim(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Patient Information</h4>
                    <div className="space-y-2">
                      <p><span className="text-sm text-gray-600">Name:</span> <span className="text-sm font-medium">{selectedClaim.patientName}</span></p>
                      <p><span className="text-sm text-gray-600">Patient ID:</span> <span className="text-sm font-medium">{selectedClaim.patientId}</span></p>
                      <p><span className="text-sm text-gray-600">Phone:</span> <span className="text-sm font-medium">{selectedClaim.patientPhone}</span></p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Insurance Information</h4>
                    <div className="space-y-2">
                      <p><span className="text-sm text-gray-600">Provider:</span> <span className="text-sm font-medium">{selectedClaim.insuranceProvider}</span></p>
                      <p><span className="text-sm text-gray-600">Policy:</span> <span className="text-sm font-medium">{selectedClaim.policyNumber}</span></p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Claim Details</h4>
                    <div className="space-y-2">
                      <p><span className="text-sm text-gray-600">Claim ID:</span> <span className="text-sm font-medium">{selectedClaim.id}</span></p>
                      <p><span className="text-sm text-gray-600">Service Date:</span> <span className="text-sm font-medium">{new Date(selectedClaim.serviceDate).toLocaleDateString()}</span></p>
                      <p><span className="text-sm text-gray-600">Submission:</span> <span className="text-sm font-medium">{new Date(selectedClaim.submissionDate).toLocaleDateString()}</span></p>
                      <p><span className="text-sm text-gray-600">Diagnosis:</span> <span className="text-sm font-medium">{selectedClaim.diagnosis}</span></p>
                      <p><span className="text-sm text-gray-600">Procedures:</span> <span className="text-sm font-medium">{selectedClaim.procedureCodes.join(', ')}</span></p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Financial Information</h4>
                    <div className="space-y-2">
                      <p><span className="text-sm text-gray-600">Claim Amount:</span> <span className="text-sm font-medium">${selectedClaim.claimAmount.toLocaleString()}</span></p>
                      {selectedClaim.approvedAmount > 0 && (
                        <p><span className="text-sm text-gray-600">Approved:</span> <span className="text-sm font-medium text-green-600">${selectedClaim.approvedAmount.toLocaleString()}</span></p>
                      )}
                      <p><span className="text-sm text-gray-600">Status:</span> 
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedClaim.status)}`}>
                          {selectedClaim.status.charAt(0).toUpperCase() + selectedClaim.status.slice(1)}
                        </span>
                      </p>
                      {selectedClaim.denialReason && (
                        <p><span className="text-sm text-gray-600">Denial Reason:</span> <span className="text-sm font-medium text-red-600">{selectedClaim.denialReason}</span></p>
                      )}
                    </div>
                  </div>
                </div>
                
                {selectedClaim.notes && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedClaim.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Edit Claim
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Claim Modal */}
        {showNewClaimModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Submit New Insurance Claim</h3>
                  <button
                    onClick={() => setShowNewClaimModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Patient Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Patient
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select Patient</option>
                        <option value="P-1001">John Smith (P-1001)</option>
                        <option value="P-1002">Sarah Johnson (P-1002)</option>
                        <option value="P-1003">Michael Brown (P-1003)</option>
                      </select>
                    </div>

                    {/* Insurance Provider */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Insurance Provider
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select Provider</option>
                        <option value="bcbs">Blue Cross Blue Shield</option>
                        <option value="aetna">Aetna Healthcare</option>
                        <option value="humana">Humana</option>
                      </select>
                    </div>

                    {/* Service Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Date
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Claim Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Claim Amount
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Diagnosis */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Diagnosis
                      </label>
                      <input
                        type="text"
                        placeholder="Primary diagnosis"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Procedure Codes */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Procedure Codes
                      </label>
                      <input
                        type="text"
                        placeholder="Enter CPT codes separated by commas (e.g., 99213, 90801)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Enter any additional information about this claim"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewClaimModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Submit Claim
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 sm:mt-12">
          <Footer />
        </div>
      </div>
    </div>
  );
}
