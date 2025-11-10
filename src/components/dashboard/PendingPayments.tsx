import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Payment {
  patient: string;
  amount: number;
  daysPending: number;
}

const PendingPayments: React.FC<{ payments: Payment[] }> = ({ payments }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-fit">
    <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center">
      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 mr-2 flex-shrink-0" />
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Pending Payments</h2>
    </div>
    <div className="p-4 sm:p-6">
      <div className="space-y-3 sm:space-y-4">
        {payments.map((payment, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <div className="min-w-0 flex-1 mr-3">
              <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                {payment.patient}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                {payment.daysPending} days pending
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                ${payment.amount.toLocaleString()}
              </p>
              {payment.daysPending > 15 && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">Overdue</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 sm:mt-6 px-4 py-3 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm sm:text-base touch-manipulation">
        Send Payment Reminders
      </button>
    </div>
  </div>
);

export default PendingPayments;
