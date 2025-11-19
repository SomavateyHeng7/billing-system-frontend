'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  ReceiptIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DownloadIcon,
  MailIcon,
  DollarSignIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  CalendarIcon,
  UserIcon
} from 'lucide-react';
import { Sidebar } from '../../components/layout/sidebar';
import { Header } from '../../components/shared/header';
import Footer from '../../components/shared/footer';

// Mock invoice data
const mockInvoices = [
  {
    id: 'INV-2024-001',
    patientId: 1,
    patientName: 'John Smith',
    dateIssued: '2024-11-01',
    dueDate: '2024-12-01',
    amount: 450.00,
    paidAmount: 0.00,
    status: 'Sent',
    type: 'Standard',
    description: 'Annual Physical Exam',
    provider: 'Dr. Johnson',
    services: [
      { code: '99213', description: 'Office Visit', quantity: 1, unitPrice: 200.00 },
      { code: '80053', description: 'Comprehensive Metabolic Panel', quantity: 1, unitPrice: 150.00 },
      { code: '85025', description: 'Complete Blood Count', quantity: 1, unitPrice: 100.00 }
    ],
    lastPaymentDate: null,
    insurance: 'Blue Cross Blue Shield'
  },
  {
    id: 'INV-2024-002',
    patientId: 2,
    patientName: 'Sarah Johnson',
    dateIssued: '2024-10-28',
    dueDate: '2024-11-28',
    amount: 275.00,
    paidAmount: 275.00,
    status: 'Paid',
    type: 'Standard',
    description: 'Follow-up Consultation',
    provider: 'Dr. Smith',
    services: [
      { code: '99214', description: 'Office Visit - Detailed', quantity: 1, unitPrice: 275.00 }
    ],
    lastPaymentDate: '2024-11-02',
    insurance: 'Aetna'
  },
  {
    id: 'INV-2024-003',
    patientId: 3,
    patientName: 'Michael Brown',
    dateIssued: '2024-10-15',
    dueDate: '2024-11-15',
    amount: 1250.00,
    paidAmount: 500.00,
    status: 'Partial',
    type: 'Standard',
    description: 'Emergency Visit & Treatment',
    provider: 'Dr. Wilson',
    services: [
      { code: '99285', description: 'Emergency Dept Visit - High', quantity: 1, unitPrice: 800.00 },
      { code: '71020', description: 'Chest X-Ray', quantity: 1, unitPrice: 200.00 },
      { code: '36415', description: 'Blood Draw', quantity: 1, unitPrice: 50.00 },
      { code: '80048', description: 'Basic Metabolic Panel', quantity: 2, unitPrice: 100.00 }
    ],
    lastPaymentDate: '2024-10-20',
    insurance: 'Medicare'
  },
  {
    id: 'INV-2024-004',
    patientId: 1,
    patientName: 'John Smith',
    dateIssued: '2024-09-20',
    dueDate: '2024-10-20',
    amount: 125.00,
    paidAmount: 0.00,
    status: 'Overdue',
    type: 'Recurring',
    description: 'Diabetes Management',
    provider: 'Dr. Johnson',
    services: [
      { code: '99213', description: 'Office Visit', quantity: 1, unitPrice: 125.00 }
    ],
    lastPaymentDate: null,
    insurance: 'Blue Cross Blue Shield'
  }
];

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = 
      invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesDate = () => {
      if (dateFilter === 'all') return true;
      const invoiceDate = new Date(invoice.dateIssued);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today': return daysDiff === 0;
        case 'week': return daysDiff <= 7;
        case 'month': return daysDiff <= 30;
        default: return true;
      }
    };
    
    return matchesSearch && matchesStatus && matchesDate();
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'sent':
        return <ClockIcon className="h-5 w-5 text-blue-600" />;
      case 'partial':
        return <AlertTriangleIcon className="h-5 w-5 text-yellow-600" />;
      case 'overdue':
        return <AlertTriangleIcon className="h-5 w-5 text-red-600" />;
      case 'draft':
        return <PencilIcon className="h-5 w-5 text-gray-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate statistics
  const totalInvoices = mockInvoices.length;
  const totalAmount = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = mockInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalOutstanding = totalAmount - totalPaid;
  const overdueCount = mockInvoices.filter(inv => inv.status === 'Overdue').length;

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
            Invoice Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 sm:mt-2">
            Create, manage, and track all your hospital invoices and billing statements
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <Link 
            href="/invoices/recurring"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
          >
            <CalendarIcon className="h-4 w-4" />
            <span>Recurring Billing</span>
          </Link>
          <Link 
            href="/invoices/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Invoice</span>
          </Link>
        </div>

        {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalInvoices}</p>
                </div>
                <ReceiptIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">${totalAmount.toLocaleString()}</p>
                </div>
                <DollarSignIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Outstanding</p>
                  <p className="text-2xl font-bold text-orange-600">${totalOutstanding.toLocaleString()}</p>
                </div>
                <ClockIcon className="h-8 w-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
                </div>
                <AlertTriangleIcon className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search invoices by patient name, invoice ID, or description..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="partial">Partial Payment</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                  <select
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                  <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <FilterIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/invoices/new" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 text-center group">
            <PlusIcon className="h-8 w-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
            <p className="text-sm font-medium text-gray-900">Create Invoice</p>
          </Link>
          <Link href="/invoices/templates" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 text-center group">
            <ReceiptIcon className="h-8 w-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
            <p className="text-sm font-medium text-gray-900">Invoice Templates</p>
          </Link>
          <Link href="/invoices/payments" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 text-center group">
            <DollarSignIcon className="h-8 w-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
            <p className="text-sm font-medium text-gray-900">Payment Tracking</p>
          </Link>
          <Link href="/invoices/reports" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 text-center group">
            <FilterIcon className="h-8 w-8 text-orange-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
            <p className="text-sm font-medium text-gray-900">Reports</p>
          </Link>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Invoice List</h3>
            <p className="text-sm text-gray-600">Showing {filteredInvoices.length} invoices</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                        <div className="text-sm text-gray-500">{new Date(invoice.dateIssued).toLocaleDateString()}</div>
                        {invoice.type === 'Recurring' && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            Recurring
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{invoice.patientName}</div>
                          <div className="text-sm text-gray-500">{invoice.insurance}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.description}</div>
                      <div className="text-sm text-gray-500">{invoice.provider}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${invoice.amount.toFixed(2)}</div>
                      {invoice.paidAmount > 0 && (
                        <div className="text-sm text-green-600">Paid: ${invoice.paidAmount.toFixed(2)}</div>
                      )}
                      {invoice.amount > invoice.paidAmount && (
                        <div className="text-sm text-red-600">Due: ${(invoice.amount - invoice.paidAmount).toFixed(2)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(invoice.status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/invoices/${invoice.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <Link 
                          href={`/invoices/${invoice.id}/edit`}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button 
                          className="text-purple-600 hover:text-purple-900"
                          title="Download PDF"
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-orange-600 hover:text-orange-900"
                          title="Send Email"
                        >
                          <MailIcon className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-8 sm:mt-12">
          <Footer />
        </div>
      </div>
    </div>
  );
}