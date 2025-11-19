"use client";

import React, { useState } from 'react';
import { 
  FileText, Search, CheckCircle, XCircle, Clock, 
  Filter, Download, Eye, Edit, DollarSign, Calendar,
  AlertCircle, RefreshCw, Send, Archive, Building2, TrendingUp
} from 'lucide-react';

interface InsuranceClaim {
  id: string;
  patientName: string;
  patientId: string;
  policyNumber: string;
  insuranceProvider: string;
  claimAmount: number;
  approvedAmount?: number;
  serviceDate: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review' | 'resubmitted';
  serviceType: 'OPD' | 'IPD' | 'Emergency' | 'Surgery' | 'Diagnostic';
  diagnosis: string;
  documents: string[];
  notes?: string;
}

interface InsuranceProvider {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  processingTime: string;
  approvalRate: number;
  coverageTypes: string[];
}

const InsuranceProcessing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('claims');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(null);
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);

  // Mock data
  const claims: InsuranceClaim[] = [
    {
      id: 'CL001',
      patientName: 'John Smith',
      patientId: 'P001',
      policyNumber: 'POL123456',
      insuranceProvider: 'HealthCare Plus',
      claimAmount: 2500,
      approvedAmount: 2200,
      serviceDate: '2024-03-10',
      submissionDate: '2024-03-11',
      status: 'approved',
      serviceType: 'IPD',
      diagnosis: 'Appendicitis',
      documents: ['medical_report.pdf', 'lab_results.pdf'],
      notes: 'Pre-authorization obtained'
    },
    {
      id: 'CL002',
      patientName: 'Maria Garcia',
      patientId: 'P002',
      policyNumber: 'POL789012',
      insuranceProvider: 'MedSecure',
      claimAmount: 850,
      serviceDate: '2024-03-12',
      submissionDate: '2024-03-12',
      status: 'under_review',
      serviceType: 'OPD',
      diagnosis: 'Hypertension follow-up',
      documents: ['consultation_note.pdf']
    },
    {
      id: 'CL003',
      patientName: 'David Chen',
      patientId: 'P003',
      policyNumber: 'POL345678',
      insuranceProvider: 'Global Health',
      claimAmount: 1200,
      serviceDate: '2024-03-08',
      submissionDate: '2024-03-09',
      status: 'rejected',
      serviceType: 'Diagnostic',
      diagnosis: 'MRI scan - non-covered procedure',
      documents: ['mri_report.pdf'],
      notes: 'Not covered under current policy'
    }
  ];

  const insuranceProviders: InsuranceProvider[] = [
    {
      id: 'IP001',
      name: 'HealthCare Plus',
      contactPerson: 'Sarah Johnson',
      email: 'claims@healthcareplus.com',
      phone: '+1 (555) 123-4567',
      processingTime: '5-7 business days',
      approvalRate: 92.5,
      coverageTypes: ['IPD', 'OPD', 'Emergency', 'Surgery']
    },
    {
      id: 'IP002',
      name: 'MedSecure',
      contactPerson: 'Robert Wilson',
      email: 'processing@medsecure.com',
      phone: '+1 (555) 987-6543',
      processingTime: '3-5 business days',
      approvalRate: 87.8,
      coverageTypes: ['OPD', 'Diagnostic', 'Pharmacy']
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
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      under_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      resubmitted: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const ClaimsTable = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-600">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Insurance Claims</h3>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="under_review">Under Review</option>
              <option value="resubmitted">Resubmitted</option>
            </select>
            <button
              onClick={() => setShowNewClaimModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              New Claim
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Claim ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Insurance Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Service Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {filteredClaims.map((claim) => (
              <tr key={claim.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {claim.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{claim.patientName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{claim.patientId}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900 dark:text-white">{claim.insuranceProvider}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{claim.policyNumber}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {claim.serviceType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(claim.claimAmount)}</div>
                    {claim.approvedAmount && (
                      <div className="text-sm text-green-600 dark:text-green-400">
                        Approved: {formatCurrency(claim.approvedAmount)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(claim.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setSelectedClaim(claim)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Eye size={16} />
                  </button>
                  <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                    <Edit size={16} />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ProvidersTable = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Insurance Providers</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Processing Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Approval Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Coverage Types</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {insuranceProviders.map((provider) => (
              <tr key={provider.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{provider.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900 dark:text-white">{provider.contactPerson}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{provider.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {provider.processingTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`text-sm font-medium ${
                      provider.approvalRate >= 90 ? 'text-green-600' : 
                      provider.approvalRate >= 80 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {provider.approvalRate}%
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {provider.coverageTypes.map((type) => (
                      <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {type}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Claims</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{claims.length}</p>
            </div>
            <FileText className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Approved Claims</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {claims.filter(c => c.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {claims.filter(c => c.status === 'pending' || c.status === 'under_review').length}
              </p>
            </div>
            <Clock className="text-yellow-600 dark:text-yellow-400" size={24} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(claims.reduce((sum, claim) => sum + claim.claimAmount, 0))}
              </p>
            </div>
            <DollarSign className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-600">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'claims', label: 'Claims Management', icon: FileText },
              { id: 'providers', label: 'Insurance Providers', icon: Building2 },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'claims' && <ClaimsTable />}
          {activeTab === 'providers' && <ProvidersTable />}
          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <TrendingUp className="mx-auto text-gray-400" size={48} />
              <p className="mt-4 text-gray-500">Analytics dashboard coming soon</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Claim Details Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Claim Details - {selectedClaim.id}</h2>
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Patient Name</label>
                  <p className="text-gray-900 dark:text-white">{selectedClaim.patientName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Patient ID</label>
                  <p className="text-gray-900 dark:text-white">{selectedClaim.patientId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Policy Number</label>
                  <p className="text-gray-900 dark:text-white">{selectedClaim.policyNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Insurance Provider</label>
                  <p className="text-gray-900 dark:text-white">{selectedClaim.insuranceProvider}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Service Date</label>
                  <p className="text-gray-900 dark:text-white">{selectedClaim.serviceDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Service Type</label>
                  <p className="text-gray-900 dark:text-white">{selectedClaim.serviceType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Claim Amount</label>
                  <p className="text-gray-900 dark:text-white font-semibold">{formatCurrency(selectedClaim.claimAmount)}</p>
                </div>
                {selectedClaim.approvedAmount && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Approved Amount</label>
                    <p className="text-green-600 dark:text-green-400 font-semibold">{formatCurrency(selectedClaim.approvedAmount)}</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Status</label>
                <div className="mt-1">{getStatusBadge(selectedClaim.status)}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Diagnosis</label>
                <p className="text-gray-900 dark:text-white">{selectedClaim.diagnosis}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Documents</label>
                <div className="mt-2 space-y-2">
                  {selectedClaim.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-sm text-gray-900 dark:text-white">{doc}</span>
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedClaim.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Notes</label>
                  <p className="text-gray-900 dark:text-white">{selectedClaim.notes}</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedClaim(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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
    </div>
  );
};

export default InsuranceProcessing;