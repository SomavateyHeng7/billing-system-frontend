"use client";

import React, { useState } from 'react';
import { 
  RefreshCw, DollarSign, Search, Filter, CheckCircle, 
  XCircle, Clock, AlertTriangle, FileText, Eye, Plus,
  User, Calendar, CreditCard, Edit, Download, TrendingDown
} from 'lucide-react';

interface RefundRequest {
  id: string;
  patientName: string;
  patientId: string;
  originalBillId: string;
  refundAmount: number;
  originalAmount: number;
  reason: string;
  category: 'Full Refund' | 'Partial Refund' | 'Billing Error' | 'Service Cancellation' | 'Insurance Adjustment';
  requestDate: string;
  requestedBy: string;
  approvedBy?: string;
  processedDate?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Processed' | 'Under Review';
  paymentMethod: string;
  refundMethod: 'Original Payment Method' | 'Bank Transfer' | 'Cash' | 'Check';
  notes?: string;
  attachments?: string[];
}

interface Adjustment {
  id: string;
  patientName: string;
  patientId: string;
  billId: string;
  adjustmentAmount: number;
  adjustmentType: 'Discount' | 'Waiver' | 'Correction' | 'Late Fee' | 'Interest';
  reason: string;
  approvedBy: string;
  adjustmentDate: string;
  status: 'Applied' | 'Pending' | 'Reversed';
  notes?: string;
}

const RefundsAdjustments: React.FC = () => {
  const [activeTab, setActiveTab] = useState('refunds');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [showNewRefundModal, setShowNewRefundModal] = useState(false);

  // Mock data
  const refundRequests: RefundRequest[] = [
    {
      id: 'REF001',
      patientName: 'John Smith',
      patientId: 'P001',
      originalBillId: 'BILL2024001',
      refundAmount: 500,
      originalAmount: 2500,
      reason: 'Service not provided due to equipment malfunction',
      category: 'Service Cancellation',
      requestDate: '2024-03-10',
      requestedBy: 'Dr. Sarah Johnson',
      approvedBy: 'Finance Manager',
      processedDate: '2024-03-12',
      status: 'Processed',
      paymentMethod: 'Credit Card',
      refundMethod: 'Original Payment Method',
      notes: 'MRI scan cancelled due to machine breakdown'
    },
    {
      id: 'REF002',
      patientName: 'Maria Garcia',
      patientId: 'P002',
      originalBillId: 'BILL2024002',
      refundAmount: 150,
      originalAmount: 350,
      reason: 'Duplicate billing error',
      category: 'Billing Error',
      requestDate: '2024-03-14',
      requestedBy: 'Billing Clerk',
      status: 'Approved',
      paymentMethod: 'Cash',
      refundMethod: 'Cash',
      notes: 'Consultation fee charged twice'
    },
    {
      id: 'REF003',
      patientName: 'David Chen',
      patientId: 'P003',
      originalBillId: 'BILL2024003',
      refundAmount: 1200,
      originalAmount: 1200,
      reason: 'Insurance coverage approved retroactively',
      category: 'Insurance Adjustment',
      requestDate: '2024-03-15',
      requestedBy: 'Insurance Coordinator',
      status: 'Under Review',
      paymentMethod: 'Bank Transfer',
      refundMethod: 'Bank Transfer'
    }
  ];

  const adjustments: Adjustment[] = [
    {
      id: 'ADJ001',
      patientName: 'Sarah Johnson',
      patientId: 'P004',
      billId: 'BILL2024004',
      adjustmentAmount: -200,
      adjustmentType: 'Discount',
      reason: 'Senior citizen discount applied',
      approvedBy: 'Dr. Wilson',
      adjustmentDate: '2024-03-10',
      status: 'Applied',
      notes: '10% senior citizen discount'
    },
    {
      id: 'ADJ002',
      patientName: 'Mike Wilson',
      patientId: 'P005',
      billId: 'BILL2024005',
      adjustmentAmount: -500,
      adjustmentType: 'Waiver',
      reason: 'Compassionate care program',
      approvedBy: 'Hospital Administrator',
      adjustmentDate: '2024-03-12',
      status: 'Applied',
      notes: 'Financial hardship waiver approved'
    },
    {
      id: 'ADJ003',
      patientName: 'Emily Davis',
      patientId: 'P006',
      billId: 'BILL2024006',
      adjustmentAmount: 50,
      adjustmentType: 'Correction',
      reason: 'Laboratory fee correction',
      approvedBy: 'Lab Supervisor',
      adjustmentDate: '2024-03-14',
      status: 'Applied',
      notes: 'Additional test charges added'
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
      'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Approved': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Processed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Under Review': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Applied': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Reversed': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Full Refund': 'text-red-600',
      'Partial Refund': 'text-orange-600',
      'Billing Error': 'text-purple-600',
      'Service Cancellation': 'text-blue-600',
      'Insurance Adjustment': 'text-green-600',
      'Discount': 'text-green-600',
      'Waiver': 'text-blue-600',
      'Correction': 'text-orange-600',
      'Late Fee': 'text-red-600',
      'Interest': 'text-purple-600'
    };
    return colors[category as keyof typeof colors] || 'text-gray-600';
  };

  const filteredRefunds = refundRequests.filter(refund => {
    const matchesSearch = 
      refund.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || refund.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const RefundsTable = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-600">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Refund Requests</h3>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search refunds..."
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
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Processed">Processed</option>
              <option value="Under Review">Under Review</option>
            </select>
            <button
              onClick={() => setShowNewRefundModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>New Refund</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Refund ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Original Bill</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Refund Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {filteredRefunds.map((refund) => (
              <tr key={refund.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {refund.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{refund.patientName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{refund.patientId}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900 dark:text-white">{refund.originalBillId}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{formatCurrency(refund.originalAmount)}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-red-600 dark:text-red-400">
                    {formatCurrency(refund.refundAmount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getCategoryColor(refund.category)}`}>
                    {refund.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(refund.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Date(refund.requestDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => setSelectedRefund(refund)}
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

  const AdjustmentsTable = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bill Adjustments</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Adjustment ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bill ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Adjustment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Approved By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {adjustments.map((adjustment) => (
              <tr key={adjustment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {adjustment.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{adjustment.patientName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{adjustment.patientId}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {adjustment.billId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    adjustment.adjustmentAmount < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    {adjustment.adjustmentAmount < 0 ? '-' : '+'}{formatCurrency(Math.abs(adjustment.adjustmentAmount))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getCategoryColor(adjustment.adjustmentType)}`}>
                    {adjustment.adjustmentType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {adjustment.approvedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(adjustment.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Date(adjustment.adjustmentDate).toLocaleDateString()}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Refunds</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(refundRequests.reduce((sum, r) => sum + r.refundAmount, 0))}
              </p>
            </div>
            <TrendingDown className="text-red-600 dark:text-red-400" size={24} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Refunds</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {refundRequests.filter(r => r.status === 'Pending' || r.status === 'Under Review').length}
              </p>
            </div>
            <Clock className="text-yellow-600 dark:text-yellow-400" size={24} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Adjustments</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(Math.abs(adjustments.reduce((sum, a) => sum + a.adjustmentAmount, 0)))}
              </p>
            </div>
            <RefreshCw className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Processed Today</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {refundRequests.filter(r => r.status === 'Processed' && 
                  new Date(r.processedDate || '').toDateString() === new Date().toDateString()).length}
              </p>
            </div>
            <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-600">
        <nav className="flex space-x-8">
          {[
            { id: 'refunds', label: 'Refunds', icon: RefreshCw },
            { id: 'adjustments', label: 'Adjustments', icon: Edit },
            { id: 'analytics', label: 'Analytics', icon: TrendingDown }
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

      {/* Content */}
      {activeTab === 'refunds' && <RefundsTable />}
      {activeTab === 'adjustments' && <AdjustmentsTable />}
      {activeTab === 'analytics' && (
        <div className="text-center py-12">
          <TrendingDown className="mx-auto text-gray-400" size={48} />
          <p className="mt-4 text-gray-500">Refunds & adjustments analytics coming soon</p>
        </div>
      )}

      {/* Refund Details Modal */}
      {selectedRefund && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Refund Details - {selectedRefund.id}</h2>
                <button
                  onClick={() => setSelectedRefund(null)}
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
                  <p className="text-gray-900 dark:text-white">{selectedRefund.patientName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Patient ID</label>
                  <p className="text-gray-900 dark:text-white">{selectedRefund.patientId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Original Bill ID</label>
                  <p className="text-gray-900 dark:text-white">{selectedRefund.originalBillId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Category</label>
                  <p className={`font-medium ${getCategoryColor(selectedRefund.category)}`}>{selectedRefund.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Original Amount</label>
                  <p className="text-gray-900 dark:text-white font-semibold">{formatCurrency(selectedRefund.originalAmount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Refund Amount</label>
                  <p className="text-red-600 dark:text-red-400 font-semibold">{formatCurrency(selectedRefund.refundAmount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Payment Method</label>
                  <p className="text-gray-900 dark:text-white">{selectedRefund.paymentMethod}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Refund Method</label>
                  <p className="text-gray-900 dark:text-white">{selectedRefund.refundMethod}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Status</label>
                <div className="mt-1">{getStatusBadge(selectedRefund.status)}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Reason</label>
                <p className="text-gray-900 dark:text-white">{selectedRefund.reason}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Requested By</label>
                  <p className="text-gray-900 dark:text-white">{selectedRefund.requestedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Request Date</label>
                  <p className="text-gray-900 dark:text-white">{new Date(selectedRefund.requestDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              {selectedRefund.approvedBy && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Approved By</label>
                    <p className="text-gray-900 dark:text-white">{selectedRefund.approvedBy}</p>
                  </div>
                  {selectedRefund.processedDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Processed Date</label>
                      <p className="text-gray-900 dark:text-white">{new Date(selectedRefund.processedDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              )}
              
              {selectedRefund.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Notes</label>
                  <p className="text-gray-900 dark:text-white">{selectedRefund.notes}</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedRefund(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Close
              </button>
              {selectedRefund.status === 'Pending' && (
                <>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Reject
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundsAdjustments;