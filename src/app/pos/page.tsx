'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

import EnhancedPOSInterface from '@/components/pos/EnhancedPOSInterface';
import InventoryManagement from '@/components/pos/InventoryManagement2';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/shared/header';
import Footer from '@/components/shared/footer';

import { ShoppingCart, Package, BarChart3 } from 'lucide-react';

export default function POSPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Container */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-14' : 'ml-56'}`}>
        
        {/* Header */}
        <Header sidebarCollapsed={sidebarCollapsed} />

        {/* Main Content */}
        <main className="pt-20 px-6 pb-10">
          {/* Header Section */}
          <div className="border-b shadow-sm">
            <div className="py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                    Point of Sale System
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Pharmacy billing and inventory management system
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  🟢 Online
                </span>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="py-6">
            <Tabs defaultValue="billing" className="space-y-6">
              
              <TabsList className="grid w-full grid-cols-3 max-w-lg bg-gray-100 dark:bg-gray-800 rounded-lg">
                <TabsTrigger value="billing" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  POS Terminal
                </TabsTrigger>

                <TabsTrigger value="inventory" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Inventory
                </TabsTrigger>

                <TabsTrigger value="reports" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Reports
                </TabsTrigger>
              </TabsList>

              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardContent className="p-0">
                    <EnhancedPOSInterface />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Inventory Tab */}
              <TabsContent value="inventory" className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <Package className="h-5 w-5 text-blue-600" />
                          Inventory Management
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          Manage stock levels, track expiry dates, and monitor inventory
                        </p>
                      </div>
                    </div>

                    <InventoryManagement />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports" className="space-y-6">
                <Card className="shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="text-center py-12">
                      <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />

                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Sales & Inventory Reports
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        View detailed analytics for sales performance, inventory turnover, and revenue trends.
                      </p>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Daily Sales Report</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Track daily revenue and transaction volume</p>
                        </div>

                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Inventory Turnover</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Monitor stock movement and reorder points</p>
                        </div>

                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Expiry Management</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Track medications nearing expiration</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
