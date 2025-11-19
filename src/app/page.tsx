"use client";

import React, { useState } from 'react';
import { DollarSign, FileText, Users, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentInvoices from '@/components/dashboard/RecentInvoices';
import PendingPayments from '@/components/dashboard/PendingPayments';
import Footer from '@/components/shared/footer';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/shared/header';

const BillingDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const stats = {
    totalRevenue: 125000,
    pendingInvoices: 15,
    totalPatients: 342,
    monthlyGrowth: 8.5,
  };

  const recentInvoices = [
    { id: 'INV-001', patient: 'John Doe', amount: 1200, status: 'paid', date: '2025-11-08' },
    { id: 'INV-002', patient: 'Jane Smith', amount: 800, status: 'pending', date: '2025-11-07' },
    { id: 'INV-003', patient: 'Mike Johnson', amount: 1500, status: 'overdue', date: '2025-11-06' },
    { id: 'INV-004', patient: 'Sarah Wilson', amount: 950, status: 'paid', date: '2025-11-05' },
  ];

  const pendingPayments = [
    { patient: 'Alice Brown', amount: 2200, daysPending: 5 },
    { patient: 'Robert Davis', amount: 1800, daysPending: 12 },
    { patient: 'Emma Martinez', amount: 3200, daysPending: 18 },
  ];

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
        {/* Dashboard Content */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
            Billing Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 sm:mt-2">
            Overview of your hospital&apos;s billing and financial data
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />}
            iconBg="bg-green-100"
            subtitle="+12% from last month"
            subtitleColor="text-green-600"
          />
          <StatCard
            title="Pending Invoices"
            value={stats.pendingInvoices}
            icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />}
            iconBg="bg-yellow-100"
            subtitle="Requires attention"
            subtitleColor="text-yellow-600"
          />
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />}
            iconBg="bg-blue-100"
            subtitle="Active this month"
            subtitleColor="text-blue-600"
          />
          <StatCard
            title="Monthly Growth"
            value={`${stats.monthlyGrowth}%`}
            icon={<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />}
            iconBg="bg-purple-100"
            subtitle="Revenue increase"
            subtitleColor="text-purple-600"
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8">
          <div className="xl:col-span-2">
            <RecentInvoices invoices={recentInvoices} />
          </div>
          <div className="xl:col-span-1">
            <PendingPayments payments={pendingPayments} />
          </div>
        </div>
        <div className="mt-8 sm:mt-12">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default BillingDashboard;