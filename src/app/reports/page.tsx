'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  DollarSignIcon,
  CalendarIcon,
  UserIcon,
  ReceiptIcon,
  CreditCardIcon,
  ClockIcon,
  BarChart3Icon,
  PieChartIcon,
  LineChartIcon,
  DownloadIcon,
  FilterIcon,
  RefreshCwIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from 'lucide-react';

import { Sidebar } from '../../components/layout/sidebar';
import { Header } from '../../components/shared/header';
import { 
  StatCard, 
  ChartCard, 
  ReportControls, 
  ReportHeader,
  ProgressBar,
  MetricsList
} from '../../components/reports';
import { formatCurrency } from '../../../lib/utils';
// Mock data for analytics
const mockAnalyticsData = {
  overview: {
    totalRevenue: 247850.00,
    totalInvoices: 1247,
    totalPayments: 1089,
    outstandingBalance: 45670.00,
    averageInvoiceValue: 198.67,
    paymentSuccessRate: 87.3,
    monthlyGrowth: 12.5,
    yearlyGrowth: 34.8
  },
  monthlyRevenue: [
    { month: 'Jan', revenue: 18450, invoices: 95, payments: 82 },
    { month: 'Feb', revenue: 21230, invoices: 108, payments: 95 },
    { month: 'Mar', revenue: 19680, invoices: 102, payments: 89 },
    { month: 'Apr', revenue: 22450, invoices: 115, payments: 101 },
    { month: 'May', revenue: 24680, invoices: 128, payments: 112 },
    { month: 'Jun', revenue: 23890, invoices: 121, payments: 106 },
    { month: 'Jul', revenue: 26340, invoices: 135, payments: 118 },
    { month: 'Aug', revenue: 25780, invoices: 132, payments: 115 },
    { month: 'Sep', revenue: 27560, invoices: 142, payments: 124 },
    { month: 'Oct', revenue: 28940, invoices: 148, payments: 131 },
    { month: 'Nov', revenue: 24870, invoices: 126, payments: 110 },
    { month: 'Dec', revenue: 22450, invoices: 115, payments: 101 }
  ],
  paymentMethods: [
    { method: 'Credit Card', amount: 128450.00, count: 542, percentage: 52 },
    { method: 'Insurance', amount: 89230.00, count: 298, percentage: 36 },
    { method: 'Cash', amount: 18670.00, count: 156, percentage: 8 },
    { method: 'Check', amount: 8920.00, count: 67, percentage: 3 },
    { method: 'Bank Transfer', amount: 2580.00, count: 26, percentage: 1 }
  ],
  serviceCategories: [
    { category: 'Office Visits', revenue: 98450.00, count: 456, percentage: 40 },
    { category: 'Laboratory', revenue: 67230.00, count: 287, percentage: 27 },
    { category: 'Emergency', revenue: 45670.00, count: 89, percentage: 18 },
    { category: 'Therapy', revenue: 23450.00, count: 178, percentage: 9 },
    { category: 'Surgery', revenue: 13050.00, count: 34, percentage: 6 }
  ],
  topPatients: [
    { id: 1, name: 'John Smith', totalPaid: 4560.00, invoiceCount: 12, lastPayment: '2024-11-06' },
    { id: 2, name: 'Sarah Johnson', totalPaid: 3890.00, invoiceCount: 8, lastPayment: '2024-11-05' },
    { id: 3, name: 'Michael Brown', totalPaid: 3450.00, invoiceCount: 15, lastPayment: '2024-11-04' },
    { id: 4, name: 'Emily Davis', totalPaid: 2980.00, invoiceCount: 7, lastPayment: '2024-11-03' },
    { id: 5, name: 'David Wilson', totalPaid: 2670.00, invoiceCount: 9, lastPayment: '2024-11-02' }
  ],
  outstandingInvoices: [
    { id: 'INV-2024-245', patient: 'Robert Miller', amount: 1250.00, daysOverdue: 15, status: 'overdue' },
    { id: 'INV-2024-246', patient: 'Lisa Anderson', amount: 890.00, daysOverdue: 8, status: 'overdue' },
    { id: 'INV-2024-247', patient: 'James Taylor', amount: 2340.00, daysOverdue: 3, status: 'due' },
    { id: 'INV-2024-248', patient: 'Maria Garcia', amount: 670.00, daysOverdue: 0, status: 'pending' },
    { id: 'INV-2024-249', patient: 'Thomas Lee', amount: 1890.00, daysOverdue: 22, status: 'overdue' }
  ],
  ageingReport: [
    { range: '0-30 days', amount: 12450.00, count: 45, percentage: 27 },
    { range: '31-60 days', amount: 18670.00, count: 32, percentage: 41 },
    { range: '61-90 days', amount: 8920.00, count: 18, percentage: 20 },
    { range: '90+ days', amount: 5630.00, count: 12, percentage: 12 }
  ]
};

interface ChartProps {
  data: any[];
  type: 'bar' | 'line' | 'pie';
  height?: number;
}

function SimpleChart({ data, type, height = 200 }: ChartProps) {
  if (type === 'bar') {
    const maxValue = Math.max(...data.map(item => item.revenue || item.amount || 0));
    
    return (
      <div className="flex items-end justify-between space-x-1" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const value = item.revenue || item.amount || 0;
          const barHeight = (value / maxValue) * (height - 40);
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="bg-blue-500 rounded-t w-full min-h-1"
                style={{ height: `${barHeight}px` }}
                title={`${item.month || item.category}: $${value.toLocaleString()}`}
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

  if (type === 'pie') {
    const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
    let cumulativePercentage = 0;
    
    return (
      <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
        <svg width={height} height={height} viewBox={`0 0 ${height} ${height}`}>
          {data.map((item, index) => {
            const percentage = (item.amount / total) * 100;
            const startAngle = (cumulativePercentage / 100) * 360;
            const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
            cumulativePercentage += percentage;

            const centerX = height / 2;
            const centerY = height / 2;
            const radius = height * 0.35;

            const x1 = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2 = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);

            const largeArc = percentage > 50 ? 1 : 0;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index % colors.length]}
              >
                <title>{`${item.method || item.category}: $${item.amount?.toLocaleString()}`}</title>
              </path>
            );
          })}
        </svg>
      </div>
    );
  }

  // Line chart (simplified)
  const maxValue = Math.max(...data.map(item => item.revenue || 0));
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * (300 - 40) + 20;
    const y = height - 40 - ((item.revenue || 0) / maxValue) * (height - 80);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="300" height={height} className="w-full">
      <polyline
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        points={points}
      />
      {data.map((item, index) => {
        const x = (index / (data.length - 1)) * (300 - 40) + 20;
        const y = height - 40 - ((item.revenue || 0) / maxValue) * (height - 80);
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="4"
            fill="#3b82f6"
          >
            <title>{`${item.month}: $${item.revenue?.toLocaleString()}`}</title>
          </circle>
        );
      })}
    </svg>
  );
}

export default function ReportsAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('12months');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const timeframes = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '12months', label: 'Last 12 Months' },
    { value: 'ytd', label: 'Year to Date' }
  ];

  const reports = [
    { value: 'overview', label: 'Financial Overview', icon: BarChart3Icon },
    { value: 'revenue', label: 'Revenue Analysis', icon: TrendingUpIcon },
    { value: 'payments', label: 'Payment Analytics', icon: CreditCardIcon },
    { value: 'outstanding', label: 'Outstanding Balances', icon: ClockIcon },
    { value: 'patients', label: 'Patient Analytics', icon: UserIcon }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUpIcon className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDownIcon className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'due': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const exportReport = () => {
    alert('Report exported successfully!');
  };

  const refreshData = () => {
    alert('Data refreshed!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <Header sidebarCollapsed={sidebarCollapsed} />
      <div className={`transition-all duration-300 pt-20 ${sidebarCollapsed ? 'ml-14' : 'ml-56'}`}>
        <ReportHeader onExportReport={exportReport} onRefreshData={refreshData} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ReportControls
            reports={reports}
            timeframes={timeframes}
            selectedReport={selectedReport}
            selectedTimeframe={selectedTimeframe}
            onReportChange={setSelectedReport}
            onTimeframeChange={setSelectedTimeframe}
          />

        {selectedReport === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Revenue"
                value={formatCurrency(mockAnalyticsData.overview.totalRevenue)}
                change={{
                  value: mockAnalyticsData.overview.yearlyGrowth,
                  period: "YoY",
                  icon: getChangeIcon(mockAnalyticsData.overview.yearlyGrowth)
                }}
                icon={DollarSignIcon}
                iconColor="text-green-600"
              />

              <StatCard
                title="Total Invoices"
                value={mockAnalyticsData.overview.totalInvoices.toLocaleString()}
                change={{
                  value: mockAnalyticsData.overview.monthlyGrowth,
                  period: "MoM",
                  icon: getChangeIcon(mockAnalyticsData.overview.monthlyGrowth)
                }}
                icon={ReceiptIcon}
                iconColor="text-blue-600"
              />

              <StatCard
                title="Outstanding Balance"
                value={formatCurrency(mockAnalyticsData.overview.outstandingBalance)}
                subtitle={`${((mockAnalyticsData.overview.outstandingBalance / mockAnalyticsData.overview.totalRevenue) * 100).toFixed(1)}% of revenue`}
                icon={AlertTriangleIcon}
                iconColor="text-red-600"
                valueColor="text-red-600"
              />

              <StatCard
                title="Payment Success Rate"
                value={`${mockAnalyticsData.overview.paymentSuccessRate}%`}
                subtitle={`${mockAnalyticsData.overview.totalPayments} of ${mockAnalyticsData.overview.totalInvoices} paid`}
                icon={CheckCircleIcon}
                iconColor="text-green-600"
                valueColor="text-green-600"
              />
            </div>

            {/* Revenue Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <ChartCard title="Monthly Revenue Trend" icon={LineChartIcon}>
                <SimpleChart data={mockAnalyticsData.monthlyRevenue} type="line" height={250} />
              </ChartCard>

              <ChartCard title="Payment Methods" icon={PieChartIcon}>
                <div className="flex items-center justify-between">
                  <SimpleChart data={mockAnalyticsData.paymentMethods} type="pie" height={200} />
                  <div className="ml-6 space-y-2">
                    {mockAnalyticsData.paymentMethods.map((method, index) => {
                      const colors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
                      return (
                        <div key={method.method} className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${colors[index]}`}></div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-900 dark:text-white">{method.method}</span>
                            <span className="text-gray-500 dark:text-gray-400 ml-1">({method.percentage}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ChartCard>
            </div>
          </>
        )}

        {selectedReport === 'revenue' && (
          <>
            {/* Revenue Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <ChartCard title="Revenue by Month" icon={BarChart3Icon} className="lg:col-span-2">
                <SimpleChart data={mockAnalyticsData.monthlyRevenue} type="bar" height={300} />
              </ChartCard>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Revenue by Service</h3>
                <div className="space-y-4">
                  {mockAnalyticsData.serviceCategories.map((service) => (
                    <ProgressBar
                      key={service.category}
                      label={service.category}
                      value={service.revenue}
                      percentage={service.percentage}
                      showValue={true}
                      showPercentage={false}
                      className="mb-4"
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {selectedReport === 'payments' && (
          <>
            {/* Payment Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <MetricsList
                title="Payment Methods Breakdown"
                items={mockAnalyticsData.paymentMethods.map(method => ({
                  id: method.method,
                  label: method.method,
                  value: method.amount,
                  subtitle: `${method.count} transactions`,
                  badge: `${method.percentage}%`,
                  status: 'info' as const
                }))}
              />

              <MetricsList
                title="Top Paying Patients"
                items={mockAnalyticsData.topPatients.map((patient, index) => ({
                  id: patient.id,
                  label: patient.name,
                  value: patient.totalPaid,
                  subtitle: `${patient.invoiceCount} invoices`,
                  badge: new Date(patient.lastPayment).toLocaleDateString(),
                  status: 'success' as const
                }))}
              />
            </div>
          </>
        )}

        {selectedReport === 'outstanding' && (
          <>
            {/* Outstanding Balances */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <MetricsList
                title="Aging Report"
                items={mockAnalyticsData.ageingReport.map(range => ({
                  id: range.range,
                  label: range.range,
                  value: range.amount,
                  subtitle: `${range.count} invoices`,
                  badge: `${range.percentage}%`,
                  status: range.range.includes('90+') ? 'error' : range.range.includes('61-90') ? 'warning' : 'info' as const
                }))}
              />

              <MetricsList
                title="Outstanding Invoices"
                items={mockAnalyticsData.outstandingInvoices.map(invoice => ({
                  id: invoice.id,
                  label: invoice.id,
                  value: invoice.amount,
                  subtitle: `${invoice.patient}${invoice.daysOverdue > 0 ? ` • ${invoice.daysOverdue} days overdue` : ''}`,
                  badge: invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1),
                  status: invoice.status === 'overdue' ? 'error' : invoice.status === 'due' ? 'warning' : 'info' as const
                }))}
              />
            </div>
          </>
        )}

        {selectedReport === 'patients' && (
          <>
            {/* Patient Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Patient Revenue Distribution</h3>
                <div className="space-y-3">
                  {mockAnalyticsData.topPatients.map((patient, index) => {
                    const maxAmount = Math.max(...mockAnalyticsData.topPatients.map(p => p.totalPaid));
                    const percentage = (patient.totalPaid / maxAmount) * 100;
                    
                    return (
                      <div key={patient.id} className="flex items-center space-x-4">
                        <div className="w-32 flex-shrink-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{patient.name}</p>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-4">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white w-20 text-right">
                              {formatCurrency(patient.totalPaid)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Patient Metrics</h3>
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(mockAnalyticsData.overview.averageInvoiceValue)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average Invoice Value</p>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {(mockAnalyticsData.topPatients.reduce((sum, p) => sum + p.totalPaid, 0) / mockAnalyticsData.topPatients.length / 1000).toFixed(1)}K
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average Patient Value</p>
                  </div>

                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {(mockAnalyticsData.topPatients.reduce((sum, p) => sum + p.invoiceCount, 0) / mockAnalyticsData.topPatients.length).toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average Invoices per Patient</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}