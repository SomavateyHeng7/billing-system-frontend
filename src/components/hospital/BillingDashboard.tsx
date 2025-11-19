"use client";

import React, { useState } from 'react';
import { 
  Building2, Users, CreditCard, FileText, TrendingUp, 
  Calendar, DollarSign, PieChart, Activity, Clock,
  UserCheck, Stethoscope, Package, Receipt
} from 'lucide-react';
import OPDBilling from './OPDBilling';
import IPDBilling from './IPDBilling';
import ProceduresBilling from './ProceduresBilling';
import PackageBilling from './PackageBilling';
import InsuranceProcessing from './InsuranceProcessing';
import PaymentGateways from './PaymentGateways';
import RefundsAdjustments from './RefundsAdjustments';
import RevenueReports from './RevenueReports';

interface DashboardStats {
  totalRevenue: number;
  opdRevenue: number;
  ipdRevenue: number;
  proceduresRevenue: number;
  packageRevenue: number;
  insuranceClaims: number;
  pendingClaims: number;
  refunds: number;
  activeIPDPatients: number;
  opdVisitsToday: number;
}

const HospitalBillingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock dashboard data
  const stats: DashboardStats = {
    totalRevenue: 485750,
    opdRevenue: 125000,
    ipdRevenue: 285000,
    proceduresRevenue: 65750,
    packageRevenue: 10000,
    insuranceClaims: 1250000,
    pendingClaims: 85000,
    refunds: 12500,
    activeIPDPatients: 45,
    opdVisitsToday: 128
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const StatCard: React.FC<{ 
    title: string; 
    value: string; 
    icon: React.ReactNode; 
    change?: string;
    color: string;
  }> = ({ title, value, icon, change, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${color}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.includes('green') ? 'bg-green-100 dark:bg-green-900' :
          color.includes('blue') ? 'bg-blue-100 dark:bg-blue-900' :
          color.includes('yellow') ? 'bg-yellow-100 dark:bg-yellow-900' :
          'bg-red-100 dark:bg-red-900'}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Building2 },
    { id: 'opd', label: 'OPD Billing', icon: UserCheck },
    { id: 'ipd', label: 'IPD Billing', icon: Activity },
    { id: 'procedures', label: 'Procedures', icon: Stethoscope },
    { id: 'packages', label: 'Packages', icon: Package },
    { id: 'insurance', label: 'Insurance', icon: FileText },
    { id: 'payments', label: 'Payment Gateway', icon: CreditCard },
    { id: 'refunds', label: 'Refunds & Adjustments', icon: Receipt },
    { id: 'reports', label: 'Revenue Reports', icon: TrendingUp }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'opd':
        return <OPDBilling />;
      case 'ipd':
        return <IPDBilling />;
      case 'procedures':
        return <ProceduresBilling />;
      case 'packages':
        return <PackageBilling />;
      case 'insurance':
        return <InsuranceProcessing />;
      case 'payments':
        return <PaymentGateways />;
      case 'refunds':
        return <RefundsAdjustments />;
      case 'reports':
        return <RevenueReports />;
      default:
        return (
          <div className="space-y-6">
            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue Today"
                value={formatCurrency(stats.totalRevenue)}
                icon={<DollarSign className="text-green-600 dark:text-green-400" size={24} />}
                change="+12.5% from yesterday"
                color="text-green-600 dark:text-green-400"
              />
              <StatCard
                title="OPD Revenue"
                value={formatCurrency(stats.opdRevenue)}
                icon={<UserCheck className="text-blue-600 dark:text-blue-400" size={24} />}
                change="+8.2% from yesterday"
                color="text-blue-600 dark:text-blue-400"
              />
              <StatCard
                title="IPD Revenue"
                value={formatCurrency(stats.ipdRevenue)}
                icon={<Activity className="text-purple-600 dark:text-purple-400" size={24} />}
                change="+15.3% from yesterday"
                color="text-purple-600 dark:text-purple-400"
              />
              <StatCard
                title="Insurance Claims"
                value={formatCurrency(stats.insuranceClaims)}
                icon={<FileText className="text-yellow-600 dark:text-yellow-400" size={24} />}
                change={`${stats.pendingClaims > 0 ? formatCurrency(stats.pendingClaims) + ' pending' : 'All processed'}`}
                color="text-yellow-600 dark:text-yellow-400"
              />
            </div>

            {/* Patient Activity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Active IPD Patients"
                value={stats.activeIPDPatients.toString()}
                icon={<Activity className="text-red-600 dark:text-red-400" size={24} />}
                change="2 admissions today"
                color="text-red-600 dark:text-red-400"
              />
              <StatCard
                title="OPD Visits Today"
                value={stats.opdVisitsToday.toString()}
                icon={<Users className="text-blue-600 dark:text-blue-400" size={24} />}
                change="Peak: 2-4 PM"
                color="text-blue-600 dark:text-blue-400"
              />
              <StatCard
                title="Procedure Revenue"
                value={formatCurrency(stats.proceduresRevenue)}
                icon={<Stethoscope className="text-green-600 dark:text-green-400" size={24} />}
                change="35 procedures today"
                color="text-green-600 dark:text-green-400"
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Billing Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { type: 'IPD', patient: 'John Smith', amount: 2500, time: '2 minutes ago', status: 'Processed' },
                    { type: 'OPD', patient: 'Maria Garcia', amount: 150, time: '5 minutes ago', status: 'Processed' },
                    { type: 'Procedure', patient: 'David Chen', amount: 800, time: '12 minutes ago', status: 'Insurance Claim' },
                    { type: 'Package', patient: 'Sarah Johnson', amount: 3200, time: '18 minutes ago', status: 'Processed' },
                    { type: 'Refund', patient: 'Mike Wilson', amount: -200, time: '25 minutes ago', status: 'Completed' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'IPD' ? 'bg-purple-100 dark:bg-purple-900' :
                          activity.type === 'OPD' ? 'bg-blue-100 dark:bg-blue-900' :
                          activity.type === 'Procedure' ? 'bg-green-100 dark:bg-green-900' :
                          activity.type === 'Package' ? 'bg-orange-100 dark:bg-orange-900' :
                          'bg-red-100 dark:bg-red-900'
                        }`}>
                          {activity.type === 'IPD' && <Activity size={16} className="text-purple-600 dark:text-purple-400" />}
                          {activity.type === 'OPD' && <UserCheck size={16} className="text-blue-600 dark:text-blue-400" />}
                          {activity.type === 'Procedure' && <Stethoscope size={16} className="text-green-600 dark:text-green-400" />}
                          {activity.type === 'Package' && <Package size={16} className="text-orange-600 dark:text-orange-400" />}
                          {activity.type === 'Refund' && <Receipt size={16} className="text-red-600 dark:text-red-400" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {activity.type} - {activity.patient}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${activity.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(Math.abs(activity.amount))}
                        </p>
                        <p className={`text-xs ${
                          activity.status === 'Processed' ? 'text-green-600' :
                          activity.status === 'Completed' ? 'text-blue-600' :
                          'text-yellow-600'
                        }`}>
                          {activity.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'New OPD Bill', icon: UserCheck, color: 'bg-blue-600 hover:bg-blue-700', action: () => setActiveTab('opd') },
                { label: 'IPD Discharge', icon: Activity, color: 'bg-purple-600 hover:bg-purple-700', action: () => setActiveTab('ipd') },
                { label: 'Process Insurance', icon: FileText, color: 'bg-yellow-600 hover:bg-yellow-700', action: () => setActiveTab('insurance') },
                { label: 'Revenue Report', icon: TrendingUp, color: 'bg-green-600 hover:bg-green-700', action: () => setActiveTab('reports') }
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} text-white p-4 rounded-lg flex items-center space-x-3 transition-colors`}
                >
                  <action.icon size={20} />
                  <span className="font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 min-h-screen">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Hospital Billing</h1>
          </div>
          <nav className="p-4">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default HospitalBillingDashboard;