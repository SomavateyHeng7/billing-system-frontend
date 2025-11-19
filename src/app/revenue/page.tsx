'use client';

import React, { useState } from 'react';

import { 
  TrendingUpIcon,
  TrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  DollarSignIcon,
  ReceiptIcon,
  CreditCardIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  PieChartIcon,
  BarChart3Icon,
  LineChartIcon,
  FilterIcon,
  RefreshCwIcon,
  DownloadIcon,
  BuildingIcon
} from 'lucide-react';

import { Sidebar } from '../../components/layout/sidebar';
import { Header } from '../../components/shared/header';
import Footer from '../../components/shared/footer';

import { 
  ChartCard, 
  ProgressBar,
  MetricsList
} from '@/components/reports';

// --------------------------------------------------------------
// TYPES
// --------------------------------------------------------------

interface RevenueData {
  id: string;
  period: string;
  totalRevenue: number;
  patientPayments: number;
  insurancePayments: number;
  cashPayments: number;
  pendingPayments: number;
  refunds: number;
  netRevenue: number;
  growth: number;
  transactions: number;
}

// --------------------------------------------------------------
// MOCK DATA
// --------------------------------------------------------------

const mockRevenueData: RevenueData[] = [
  {
    id: '1',
    period: 'January 2024',
    totalRevenue: 245670,
    patientPayments: 156780,
    insurancePayments: 67890,
    cashPayments: 21000,
    pendingPayments: 15430,
    refunds: 3240,
    netRevenue: 227240,
    growth: 12.5,
    transactions: 1247
  },
  {
    id: '2',
    period: 'February 2024',
    totalRevenue: 267890,
    patientPayments: 171230,
    insurancePayments: 73450,
    cashPayments: 23210,
    pendingPayments: 17890,
    refunds: 2780,
    netRevenue: 247890,
    growth: 15.2,
    transactions: 1356
  }
];

const mockAnalyticsData = {
  overview: {
    totalRevenue: 247850,
    totalInvoices: 1247,
    totalPayments: 1089,
    outstandingBalance: 45670,
    averageInvoiceValue: 198.67,
    paymentSuccessRate: 87.3,
    monthlyGrowth: 12.5,
    yearlyGrowth: 34.8
  },
  monthlyRevenue: [
    { month: 'Jan', revenue: 18450 },
    { month: 'Feb', revenue: 21230 },
    { month: 'Mar', revenue: 19680 },
    { month: 'Apr', revenue: 22450 },
    { month: 'May', revenue: 24680 },
    { month: 'Jun', revenue: 23890 },
    { month: 'Jul', revenue: 26340 },
    { month: 'Aug', revenue: 25780 },
    { month: 'Sep', revenue: 27560 },
    { month: 'Oct', revenue: 28940 },
    { month: 'Nov', revenue: 24870 },
    { month: 'Dec', revenue: 22450 }
  ],
  paymentMethods: [
    { method: 'Credit Card', amount: 128450, count: 542, percentage: 52 },
    { method: 'Insurance', amount: 89230, count: 298, percentage: 36 },
    { method: 'Cash', amount: 18670, count: 156, percentage: 8 },
    { method: 'Check', amount: 8920, count: 67, percentage: 3 },
    { method: 'Bank Transfer', amount: 2580, count: 26, percentage: 1 }
  ],
  serviceCategories: [
    { category: 'Office Visits', revenue: 98450, percentage: 40 },
    { category: 'Laboratory', revenue: 67230, percentage: 27 },
    { category: 'Emergency', revenue: 45670, percentage: 18 },
    { category: 'Therapy', revenue: 23450, percentage: 9 },
    { category: 'Surgery', revenue: 13050, percentage: 6 }
  ],
  topPatients: [
    { id: 1, name: 'John Smith', totalPaid: 4560, invoiceCount: 12, lastPayment: '2024-11-06' },
    { id: 2, name: 'Sarah Johnson', totalPaid: 3890, invoiceCount: 8, lastPayment: '2024-11-05' },
    { id: 3, name: 'Michael Brown', totalPaid: 3450, invoiceCount: 15, lastPayment: '2024-11-04' },
    { id: 4, name: 'Emily Davis', totalPaid: 2980, invoiceCount: 7, lastPayment: '2024-11-03' },
    { id: 5, name: 'David Wilson', totalPaid: 2670, invoiceCount: 9, lastPayment: '2024-11-02' }
  ],
  outstandingInvoices: [
    { id: 'INV-2024-245', patient: 'Robert Miller', amount: 1250, daysOverdue: 15, status: 'overdue' },
    { id: 'INV-2024-246', patient: 'Lisa Anderson', amount: 890, daysOverdue: 8, status: 'overdue' },
    { id: 'INV-2024-247', patient: 'James Taylor', amount: 2340, daysOverdue: 3, status: 'due' },
    { id: 'INV-2024-248', patient: 'Maria Garcia', amount: 670, daysOverdue: 0, status: 'pending' },
    { id: 'INV-2024-249', patient: 'Thomas Lee', amount: 1890, daysOverdue: 22, status: 'overdue' }
  ],
  ageingReport: [
    { range: '0-30 days', amount: 12450, count: 45, percentage: 27 },
    { range: '31-60 days', amount: 18670, count: 32, percentage: 41 },
    { range: '61-90 days', amount: 8920, count: 18, percentage: 20 },
    { range: '90+ days', amount: 5630, count: 12, percentage: 12 }
  ]
};

// --------------------------------------------------------------
// SIMPLE CHART (BAR / LINE / PIE)
// --------------------------------------------------------------

function SimpleChart({ data, type, height = 200 }: any) {

  // BAR CHART
  if (type === 'bar') {
    const maxValue = Math.max(...data.map((item: any) => item.revenue || item.amount || 0));

    return (
      <div className="flex items-end justify-between space-x-1 w-full" style={{ height: `${height}px` }}>
        {data.map((item: any, index: number) => {
          const value = item.revenue || item.amount || 0;
          const barHeight = (value / maxValue) * (height - 40);

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                style={{ height: `${barHeight}px` }}
                className="w-full bg-blue-500 rounded-t"
              />
              <span className="text-xs text-gray-600 mt-2 rotate-45 origin-left">
                {item.month || item.category?.substring(0, 8)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // PIE CHART
  if (type === 'pie') {
    const total = data.reduce((sum: number, item: any) => sum + item.amount, 0);
    let cumulative = 0;

    return (
      <svg width={height} height={height} viewBox={`0 0 ${height} ${height}`}>
        {data.map((item: any, index: number) => {
          const pct = (item.amount / total) * 100;
          const start = (cumulative / 100) * 360;
          const end = ((cumulative + pct) / 100) * 360;

          cumulative += pct;

          const center = height / 2;
          const radius = height * 0.35;

          const x1 = center + radius * Math.cos((start - 90) * Math.PI/180);
          const y1 = center + radius * Math.sin((start - 90) * Math.PI/180);
          const x2 = center + radius * Math.cos((end - 90) * Math.PI/180);
          const y2 = center + radius * Math.sin((end - 90) * Math.PI/180);

          const largeArc = pct > 50 ? 1 : 0;

          const path = `
            M ${center} ${center}
            L ${x1} ${y1}
            A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
            Z
          `;

          const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

          return <path key={index} d={path} fill={colors[index]} />;
        })}
      </svg>
    );
  }

  // LINE CHART
  const maxValue = Math.max(...data.map((item: any) => item.revenue));
  const points = data.map((item: any, idx: number) => {
    const x = idx * 30 + 20;
    const y = height - (item.revenue / maxValue) * (height - 40);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height}>
      <polyline fill="none" stroke="#3b82f6" strokeWidth="2" points={points} />
    </svg>
  );
}

// --------------------------------------------------------------
// MAIN PAGE
// --------------------------------------------------------------

export default function RevenueAndReportsPage() {

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const currentRevenue = mockRevenueData[0];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatPercentage = (value: number) =>
    `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">

      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <Header sidebarCollapsed={sidebarCollapsed} />

      <main className={`transition-all duration-300 p-3 sm:p-4 md:p-6 pt-16 sm:pt-18 md:pt-20 ${sidebarCollapsed ? 'ml-0 sm:ml-14' : 'ml-0 sm:ml-56'}`}>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Revenue Management & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Comprehensive financial reporting, revenue breakdowns, analytics, and performance insights.
          </p>
        </div>

        {/* TABS */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6 sm:mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3Icon },
                { id: 'revenue', label: 'Revenue Streams', icon: TrendingUpIcon },
                { id: 'payments', label: 'Payment Channels', icon: CreditCardIcon },
                { id: 'departments', label: 'Department Performance', icon: BuildingIcon },
                { id: 'analytics', label: 'Advanced Analytics', icon: LineChartIcon },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* --------------------------------------------------------------
            OVERVIEW TAB
        -------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <>
            {/* METRIC CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 sm:mb-8">
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(currentRevenue.totalRevenue)}
                </p>
                <p className="text-green-600 flex items-center space-x-1">
                  <ArrowUpIcon className="h-4 w-4" />
                  {formatPercentage(currentRevenue.growth)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockAnalyticsData.overview.totalInvoices}
                </p>
                <p className="text-green-600 flex items-center space-x-1">
                  <ArrowUpIcon className="h-4 w-4" />
                  {formatPercentage(mockAnalyticsData.overview.monthlyGrowth)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">Outstanding Balance</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(mockAnalyticsData.overview.outstandingBalance)}
                </p>
                <p className="text-sm text-gray-500">
                  {(mockAnalyticsData.overview.outstandingBalance /
                    mockAnalyticsData.overview.totalRevenue * 100).toFixed(1)}%
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockAnalyticsData.overview.paymentSuccessRate}%
                </p>
                <p className="text-sm text-gray-500">
                  {mockAnalyticsData.overview.totalPayments} / {mockAnalyticsData.overview.totalInvoices} paid
                </p>
              </div>

            </div>

            {/* REVENUE TRENDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChartCard title="Monthly Revenue Trend" icon={LineChartIcon}>
                <SimpleChart data={mockAnalyticsData.monthlyRevenue} type="line" height={250} />
              </ChartCard>

              <ChartCard title="Payment Methods" icon={PieChartIcon}>
                <div className="flex items-center justify-between">
                  <SimpleChart data={mockAnalyticsData.paymentMethods} type="pie" height={200} />
                  <div className="ml-6 space-y-2">
                    {mockAnalyticsData.paymentMethods.map((m, i) => {
                      const colors = [
                        'bg-blue-500', 'bg-red-500', 'bg-green-500',
                        'bg-yellow-500', 'bg-purple-500'
                      ];
                      return (
                        <div key={i} className="flex items-center space-x-2">
                          <span className={`w-3 h-3 rounded-full ${colors[i]}`} />
                          <span className="text-sm text-gray-900 dark:text-gray-200">
                            {m.method} ({m.percentage}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ChartCard>
            </div>
          </>
        )}

        {/* --------------------------------------------------------------
            REVENUE STREAMS
        -------------------------------------------------------------- */}

        {activeTab === 'revenue' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <ChartCard title="Revenue by Month" icon={BarChart3Icon} className="lg:col-span-2">
              <SimpleChart data={mockAnalyticsData.monthlyRevenue} type="bar" height={300} />
            </ChartCard>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Revenue by Service</h3>
              {mockAnalyticsData.serviceCategories.map((s) => (
                <ProgressBar
                  key={s.category}
                  label={s.category}
                  value={s.revenue}
                  percentage={s.percentage}
                  showValue={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------
            PAYMENT CHANNELS
        -------------------------------------------------------------- */}

        {activeTab === 'payments' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <MetricsList
              title="Payment Methods Breakdown"
              items={mockAnalyticsData.paymentMethods.map(pm => ({
                id: pm.method,
                label: pm.method,
                value: pm.amount,
                subtitle: `${pm.count} transactions`,
                badge: `${pm.percentage}%`,
                status: 'info'
              }))}
            />

            <MetricsList
              title="Top Paying Patients"
              items={mockAnalyticsData.topPatients.map(p => ({
                id: p.id,
                label: p.name,
                value: p.totalPaid,
                subtitle: `${p.invoiceCount} invoices`,
                badge: new Date(p.lastPayment).toLocaleDateString(),
                status: 'success'
              }))}
            />

          </div>
        )}

        {/* --------------------------------------------------------------
            DEPARTMENT PERFORMANCE
        -------------------------------------------------------------- */}

        {activeTab === 'departments' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <MetricsList
              title="Aging Report"
              items={mockAnalyticsData.ageingReport.map(a => ({
                id: a.range,
                label: a.range,
                value: a.amount,
                subtitle: `${a.count} invoices`,
                badge: `${a.percentage}%`,
                status:
                  a.range.includes('90+') ? 'error' :
                  a.range.includes('61-90') ? 'warning' : 'info'
              }))}
            />

            <MetricsList
              title="Outstanding Invoices"
              items={mockAnalyticsData.outstandingInvoices.map(inv => ({
                id: inv.id,
                label: inv.id,
                value: inv.amount,
                subtitle: `${inv.patient} • ${inv.daysOverdue} days overdue`,
                badge: inv.status,
                status:
                  inv.status === 'overdue' ? 'error' :
                  inv.status === 'due' ? 'warning' : 'info'
              }))}
            />

          </div>
        )}

        {/* --------------------------------------------------------------
            ADVANCED ANALYTICS
        -------------------------------------------------------------- */}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* PATIENT REVENUE BAR */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-6">Patient Revenue Distribution</h3>
              {mockAnalyticsData.topPatients.map(p => {
                const max = Math.max(...mockAnalyticsData.topPatients.map(pp => pp.totalPaid));
                const percent = (p.totalPaid / max) * 100;

                return (
                  <div key={p.id} className="my-3">
                    <div className="flex justify-between">
                      <span className="text-gray-900 dark:text-gray-200">{p.name}</span>
                      <span>{formatCurrency(p.totalPaid)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full mt-1">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* KEY METRICS */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-6">Key Performance Metrics</h3>

              <div className="text-center space-y-6">

                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(mockAnalyticsData.overview.averageInvoiceValue)}
                  </p>
                  <p className="text-sm text-gray-600">Average Invoice Value</p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {(mockAnalyticsData.topPatients.reduce((s, p) => s + p.totalPaid, 0) / mockAnalyticsData.topPatients.length / 1000).toFixed(1)}K
                  </p>
                  <p className="text-sm text-gray-600">Average Patient Value</p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {(mockAnalyticsData.topPatients.reduce((s, p) => s + p.invoiceCount, 0) / mockAnalyticsData.topPatients.length).toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600">Avg Invoices per Patient</p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatPercentage(mockAnalyticsData.overview.yearlyGrowth)}
                  </p>
                  <p className="text-sm text-gray-600">Year-over-Year Growth</p>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
