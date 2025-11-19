"use client";

import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, Download, 
  Filter, BarChart3, PieChart, LineChart, RefreshCw,
  FileText, Users, Activity, CreditCard, Building2
} from 'lucide-react';

interface RevenueData {
  period: string;
  opdRevenue: number;
  ipdRevenue: number;
  proceduresRevenue: number;
  packagesRevenue: number;
  insuranceRevenue: number;
  totalRevenue: number;
  patientCount: number;
  averageBillAmount: number;
}

interface DepartmentRevenue {
  department: string;
  revenue: number;
  patientCount: number;
  averagePerPatient: number;
  growth: number;
}

const RevenueReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('thisMonth');
  const [reportType, setReportType] = useState('summary');

  // Mock data for revenue analytics
  const revenueData: RevenueData[] = [
    {
      period: '2024-01',
      opdRevenue: 125000,
      ipdRevenue: 285000,
      proceduresRevenue: 65750,
      packagesRevenue: 45000,
      insuranceRevenue: 180000,
      totalRevenue: 520750,
      patientCount: 1250,
      averageBillAmount: 416.6
    },
    {
      period: '2024-02',
      opdRevenue: 135000,
      ipdRevenue: 295000,
      proceduresRevenue: 72000,
      packagesRevenue: 52000,
      insuranceRevenue: 195000,
      totalRevenue: 554000,
      patientCount: 1320,
      averageBillAmount: 419.7
    },
    {
      period: '2024-03',
      opdRevenue: 145000,
      ipdRevenue: 310000,
      proceduresRevenue: 78500,
      packagesRevenue: 58000,
      insuranceRevenue: 210000,
      totalRevenue: 591500,
      patientCount: 1410,
      averageBillAmount: 419.5
    }
  ];

  const departmentRevenue: DepartmentRevenue[] = [
    {
      department: 'Cardiology',
      revenue: 125000,
      patientCount: 250,
      averagePerPatient: 500,
      growth: 12.5
    },
    {
      department: 'Orthopedics',
      revenue: 98000,
      patientCount: 180,
      averagePerPatient: 544.4,
      growth: 8.3
    },
    {
      department: 'General Surgery',
      revenue: 87500,
      patientCount: 125,
      averagePerPatient: 700,
      growth: 15.2
    },
    {
      department: 'Emergency Medicine',
      revenue: 65000,
      patientCount: 420,
      averagePerPatient: 154.8,
      growth: -2.1
    },
    {
      department: 'Internal Medicine',
      revenue: 78000,
      patientCount: 350,
      averagePerPatient: 222.9,
      growth: 6.7
    },
    {
      department: 'Pediatrics',
      revenue: 45000,
      patientCount: 280,
      averagePerPatient: 160.7,
      growth: 4.2
    }
  ];

  const paymentMethodData = [
    { method: 'Insurance', amount: 285000, percentage: 48.2, count: 350 },
    { method: 'Credit Card', amount: 185000, percentage: 31.3, count: 280 },
    { method: 'Cash', amount: 75000, percentage: 12.7, count: 195 },
    { method: 'Bank Transfer', amount: 46500, percentage: 7.8, count: 85 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const currentMonthData = revenueData[revenueData.length - 1];
  const previousMonthData = revenueData[revenueData.length - 2];
  const revenueGrowth = ((currentMonthData.totalRevenue - previousMonthData.totalRevenue) / previousMonthData.totalRevenue) * 100;

  const OverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(currentMonthData.totalRevenue)}
            </p>
            <p className={`text-sm ${
              revenueGrowth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatPercentage(revenueGrowth)} from last month
            </p>
          </div>
          <DollarSign className="text-green-600 dark:text-green-400" size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Patient Count</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentMonthData.patientCount.toLocaleString()}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              +6.8% from last month
            </p>
          </div>
          <Users className="text-blue-600 dark:text-blue-400" size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Average Bill</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(currentMonthData.averageBillAmount)}
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              -0.05% from last month
            </p>
          </div>
          <FileText className="text-purple-600 dark:text-purple-400" size={24} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Insurance Revenue</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(currentMonthData.insuranceRevenue)}
            </p>
            <p className="text-sm text-orange-600 dark:text-orange-400">
              35.5% of total revenue
            </p>
          </div>
          <Building2 className="text-orange-600 dark:text-orange-400" size={24} />
        </div>
      </div>
    </div>
  );

  const RevenueBreakdown = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Breakdown by Service Type</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {[
            { label: 'IPD Revenue', amount: currentMonthData.ipdRevenue, color: 'bg-blue-500', percentage: (currentMonthData.ipdRevenue / currentMonthData.totalRevenue) * 100 },
            { label: 'OPD Revenue', amount: currentMonthData.opdRevenue, color: 'bg-green-500', percentage: (currentMonthData.opdRevenue / currentMonthData.totalRevenue) * 100 },
            { label: 'Procedures', amount: currentMonthData.proceduresRevenue, color: 'bg-purple-500', percentage: (currentMonthData.proceduresRevenue / currentMonthData.totalRevenue) * 100 },
            { label: 'Packages', amount: currentMonthData.packagesRevenue, color: 'bg-orange-500', percentage: (currentMonthData.packagesRevenue / currentMonthData.totalRevenue) * 100 }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(item.amount)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.percentage.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DepartmentTable = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Department Performance</h3>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Revenue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Patients</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Avg per Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Growth</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {departmentRevenue.map((dept, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {dept.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(dept.revenue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {dept.patientCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatCurrency(dept.averagePerPatient)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    dept.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatPercentage(dept.growth)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const PaymentMethodAnalysis = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Method Analysis</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {paymentMethodData.map((method, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="text-blue-600 dark:text-blue-400" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{method.method}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{method.count} transactions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(method.amount)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {method.percentage}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const MonthlyTrends = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Revenue Trends</h3>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {revenueData.map((data, index) => {
            const previousData = index > 0 ? revenueData[index - 1] : null;
            const growth = previousData ? ((data.totalRevenue - previousData.totalRevenue) / previousData.totalRevenue) * 100 : 0;
            
            return (
              <div key={data.period} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {new Date(data.period).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </h4>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(data.totalRevenue)}
                    </p>
                    {index > 0 && (
                      <p className={`text-sm ${
                        growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatPercentage(growth)}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">OPD Revenue</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(data.opdRevenue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">IPD Revenue</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(data.ipdRevenue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Procedures</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(data.proceduresRevenue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Patients</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {data.patientCount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Reports & Analytics</h2>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Report</option>
              <option value="department">Department Report</option>
              <option value="payment">Payment Analysis</option>
            </select>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <Download size={16} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-600">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'departments', label: 'Departments', icon: Building2 },
            { id: 'trends', label: 'Trends', icon: LineChart },
            { id: 'payments', label: 'Payment Methods', icon: CreditCard }
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

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <OverviewCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueBreakdown />
            <PaymentMethodAnalysis />
          </div>
        </div>
      )}
      
      {activeTab === 'departments' && <DepartmentTable />}
      {activeTab === 'trends' && <MonthlyTrends />}
      {activeTab === 'payments' && <PaymentMethodAnalysis />}
    </div>
  );
};

export default RevenueReports;