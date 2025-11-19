"use client";

import React, { useState } from 'react';
import { 
  CreditCard, Smartphone, Banknote, Wallet, CheckCircle, 
  XCircle, Clock, TrendingUp, DollarSign, Shield, Settings,
  RefreshCw, AlertTriangle, Eye, Download, Plus
} from 'lucide-react';

interface PaymentGateway {
  id: string;
  name: string;
  type: 'credit_card' | 'digital_wallet' | 'bank_transfer' | 'cash' | 'insurance';
  status: 'active' | 'inactive' | 'maintenance';
  transactionFee: number;
  processingTime: string;
  dailyLimit: number;
  monthlyVolume: number;
  successRate: number;
  lastTransaction?: string;
  icon: React.ComponentType<any>;
}

interface Transaction {
  id: string;
  amount: number;
  gateway: string;
  patientName: string;
  patientId: string;
  serviceType: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  timestamp: string;
  transactionId: string;
  paymentMethod: string;
  fees: number;
}

const PaymentGateways: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Mock data
  const paymentGateways: PaymentGateway[] = [
    {
      id: 'PG001',
      name: 'Stripe',
      type: 'credit_card',
      status: 'active',
      transactionFee: 2.9,
      processingTime: 'Instant',
      dailyLimit: 50000,
      monthlyVolume: 485750,
      successRate: 98.5,
      lastTransaction: '2 minutes ago',
      icon: CreditCard
    },
    {
      id: 'PG002',
      name: 'PayPal',
      type: 'digital_wallet',
      status: 'active',
      transactionFee: 3.49,
      processingTime: 'Instant',
      dailyLimit: 25000,
      monthlyVolume: 125000,
      successRate: 97.2,
      lastTransaction: '15 minutes ago',
      icon: Wallet
    },
    {
      id: 'PG003',
      name: 'Bank Transfer',
      type: 'bank_transfer',
      status: 'active',
      transactionFee: 0.5,
      processingTime: '1-2 business days',
      dailyLimit: 100000,
      monthlyVolume: 285000,
      successRate: 99.8,
      lastTransaction: '1 hour ago',
      icon: Banknote
    },
    {
      id: 'PG004',
      name: 'Apple Pay',
      type: 'digital_wallet',
      status: 'active',
      transactionFee: 2.9,
      processingTime: 'Instant',
      dailyLimit: 10000,
      monthlyVolume: 45000,
      successRate: 99.1,
      lastTransaction: '5 minutes ago',
      icon: Smartphone
    },
    {
      id: 'PG005',
      name: 'Cash Payments',
      type: 'cash',
      status: 'active',
      transactionFee: 0,
      processingTime: 'Immediate',
      dailyLimit: 0,
      monthlyVolume: 75000,
      successRate: 100,
      lastTransaction: '30 minutes ago',
      icon: Banknote
    }
  ];

  const recentTransactions: Transaction[] = [
    {
      id: 'TXN001',
      amount: 2500,
      gateway: 'Stripe',
      patientName: 'John Smith',
      patientId: 'P001',
      serviceType: 'IPD Billing',
      status: 'completed',
      timestamp: '2024-03-15 14:30:00',
      transactionId: 'txn_1234567890',
      paymentMethod: 'Visa ****1234',
      fees: 72.5
    },
    {
      id: 'TXN002',
      amount: 350,
      gateway: 'PayPal',
      patientName: 'Maria Garcia',
      patientId: 'P002',
      serviceType: 'OPD Consultation',
      status: 'completed',
      timestamp: '2024-03-15 14:15:00',
      transactionId: 'pp_abcdef123456',
      paymentMethod: 'PayPal Account',
      fees: 12.22
    },
    {
      id: 'TXN003',
      amount: 1200,
      gateway: 'Apple Pay',
      patientName: 'David Chen',
      patientId: 'P003',
      serviceType: 'Diagnostic Tests',
      status: 'pending',
      timestamp: '2024-03-15 14:00:00',
      transactionId: 'ap_xyz789012',
      paymentMethod: 'Apple Pay',
      fees: 34.8
    },
    {
      id: 'TXN004',
      amount: 850,
      gateway: 'Stripe',
      patientName: 'Sarah Johnson',
      patientId: 'P004',
      serviceType: 'Emergency Care',
      status: 'failed',
      timestamp: '2024-03-15 13:45:00',
      transactionId: 'txn_failed123',
      paymentMethod: 'Mastercard ****5678',
      fees: 0
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'inactive': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      case 'completed': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      case 'failed': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      case 'refunded': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'failed': return <XCircle size={16} />;
      case 'refunded': return <RefreshCw size={16} />;
      default: return null;
    }
  };

  const GatewayOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue Today</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$48,750</p>
              <p className="text-sm text-green-600 dark:text-green-400">+12.5% from yesterday</p>
            </div>
            <DollarSign className="text-green-600 dark:text-green-400" size={24} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Transactions Today</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">324</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">+8 from last hour</p>
            </div>
            <TrendingUp className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">98.2%</p>
              <p className="text-sm text-green-600 dark:text-green-400">Excellent performance</p>
            </div>
            <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Failed Payments</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">6</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Requires attention</p>
            </div>
            <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
          </div>
        </div>
      </div>

      {/* Payment Gateways Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentGateways.map((gateway) => {
          const Icon = gateway.icon;
          return (
            <div key={gateway.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Icon className="text-blue-600 dark:text-blue-400" size={24} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{gateway.name}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(gateway.status)}`}>
                  {gateway.status.toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Monthly Volume</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(gateway.monthlyVolume)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Transaction Fee</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {gateway.transactionFee}%
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Success Rate</span>
                  <span className={`text-sm font-medium ${
                    gateway.successRate >= 99 ? 'text-green-600' :
                    gateway.successRate >= 95 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {gateway.successRate}%
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Processing Time</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {gateway.processingTime}
                  </span>
                </div>
                
                {gateway.lastTransaction && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Last Transaction</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {gateway.lastTransaction}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => setSelectedGateway(gateway)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  View Details
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  <Settings size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const TransactionsTable = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-600">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Export Report
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Filter
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gateway</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {recentTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                  {transaction.transactionId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{transaction.patientName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{transaction.patientId}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(transaction.amount)}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">Fee: {formatCurrency(transaction.fees)}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900 dark:text-white">{transaction.gateway}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{transaction.paymentMethod}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                    {getStatusIcon(transaction.status)}
                    <span>{transaction.status.toUpperCase()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Date(transaction.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    <Eye size={16} />
                  </button>
                  <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                    <Download size={16} />
                  </button>
                  {transaction.status === 'failed' && (
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      <RefreshCw size={16} />
                    </button>
                  )}
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
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-600">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'transactions', label: 'Transactions', icon: CreditCard },
            { id: 'settings', label: 'Gateway Settings', icon: Settings }
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
      {activeTab === 'overview' && <GatewayOverview />}
      {activeTab === 'transactions' && <TransactionsTable />}
      {activeTab === 'settings' && (
        <div className="text-center py-12">
          <Settings className="mx-auto text-gray-400" size={48} />
          <p className="mt-4 text-gray-500">Gateway configuration settings coming soon</p>
        </div>
      )}

      {/* Gateway Details Modal */}
      {selectedGateway && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <selectedGateway.icon className="text-blue-600 dark:text-blue-400" size={24} />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedGateway.name} Details</h2>
                </div>
                <button
                  onClick={() => setSelectedGateway(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Gateway ID</label>
                  <p className="text-gray-900 dark:text-white">{selectedGateway.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Status</label>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedGateway.status)}`}>
                      {selectedGateway.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Transaction Fee</label>
                  <p className="text-gray-900 dark:text-white">{selectedGateway.transactionFee}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Processing Time</label>
                  <p className="text-gray-900 dark:text-white">{selectedGateway.processingTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Daily Limit</label>
                  <p className="text-gray-900 dark:text-white">
                    {selectedGateway.dailyLimit > 0 ? formatCurrency(selectedGateway.dailyLimit) : 'No Limit'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Success Rate</label>
                  <p className={`font-semibold ${
                    selectedGateway.successRate >= 99 ? 'text-green-600' :
                    selectedGateway.successRate >= 95 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {selectedGateway.successRate}%
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Monthly Volume</label>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(selectedGateway.monthlyVolume)}</p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedGateway(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Configure Gateway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentGateways;