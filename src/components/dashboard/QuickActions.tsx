import React from 'react';
import Link from 'next/link';
import { FileText, DollarSign, Users, Calendar, ShoppingCart, Package } from 'lucide-react';

const QuickActions: React.FC = () => (
  <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
    <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Quick Actions</h2>
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <Link
        href="/pos"
        className="flex items-center justify-center p-3 sm:p-4 border-2 border-dashed border-green-300 dark:border-green-600 rounded-lg hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200 touch-manipulation min-h-[60px] sm:min-h-[auto]"
      >
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-0 sm:mr-2 mb-1 sm:mb-0" />
          <span className="text-green-600 dark:text-green-400 font-medium text-xs sm:text-sm leading-tight">
            Quick Sale
          </span>
        </div>
      </Link>
      
      <Link
        href="/invoices/new"
        className="flex items-center justify-center p-3 sm:p-4 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 touch-manipulation min-h-[60px] sm:min-h-[auto]"
      >
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-0 sm:mr-2 mb-1 sm:mb-0" />
          <span className="text-blue-600 dark:text-blue-400 font-medium text-xs sm:text-sm leading-tight">
            Create Invoice
          </span>
        </div>
      </Link>
      
      <Link
        href="/payments"
        className="flex items-center justify-center p-3 sm:p-4 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-lg hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 touch-manipulation min-h-[60px] sm:min-h-[auto]"
      >
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
          <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mr-0 sm:mr-2 mb-1 sm:mb-0" />
          <span className="text-purple-600 dark:text-purple-400 font-medium text-xs sm:text-sm leading-tight">
            Record Payment
          </span>
        </div>
      </Link>
      
      <button className="flex items-center justify-center p-3 sm:p-4 border-2 border-dashed border-orange-300 dark:border-orange-600 rounded-lg hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-200 touch-manipulation min-h-[60px] sm:min-h-[auto]">
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mr-0 sm:mr-2 mb-1 sm:mb-0" />
          <span className="text-orange-600 dark:text-orange-400 font-medium text-xs sm:text-sm leading-tight">
            Add Patient
          </span>
        </div>
      </button>
      
      <Link
        href="/reports"
        className="flex items-center justify-center p-3 sm:p-4 border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-lg hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-200 touch-manipulation min-h-[60px] sm:min-h-[auto]"
      >
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 mr-0 sm:mr-2 mb-1 sm:mb-0" />
          <span className="text-indigo-600 dark:text-indigo-400 font-medium text-xs sm:text-sm leading-tight">
            View Reports
          </span>
        </div>
      </Link>
      
      <button className="flex items-center justify-center p-3 sm:p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors duration-200 touch-manipulation min-h-[60px] sm:min-h-[auto]">
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
          <Package className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 mr-0 sm:mr-2 mb-1 sm:mb-0" />
          <span className="text-gray-600 dark:text-gray-400 font-medium text-xs sm:text-sm leading-tight">
            Check Stock
          </span>
        </div>
      </button>
    </div>
  </div>
);

export default QuickActions;
