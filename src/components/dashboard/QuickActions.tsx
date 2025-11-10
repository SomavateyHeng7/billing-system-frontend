import React from 'react';
import { FileText, DollarSign, Users, Calendar } from 'lucide-react';

const QuickActions: React.FC = () => (
  <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
    <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Quick Actions</h2>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {[
        { label: 'Create Invoice', color: 'blue', icon: <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-1 sm:mr-2" /> },
        { label: 'Record Payment', color: 'green', icon: <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-1 sm:mr-2" /> },
        { label: 'Add Patient', color: 'purple', icon: <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mr-1 sm:mr-2" /> },
        { label: 'Generate Report', color: 'orange', icon: <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mr-1 sm:mr-2" /> },
      ].map((action, i) => (
        <button
          key={i}
          className={`flex items-center justify-center p-3 sm:p-4 border-2 border-dashed border-${action.color}-300 dark:border-${action.color}-600 rounded-lg hover:border-${action.color}-400 dark:hover:border-${action.color}-500 hover:bg-${action.color}-50 dark:hover:bg-${action.color}-900/20 transition-colors duration-200 touch-manipulation min-h-[60px] sm:min-h-[auto]`}
        >
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
            {action.icon}
            <span className={`text-${action.color}-600 dark:text-${action.color}-400 font-medium text-xs sm:text-sm leading-tight`}>
              {action.label}
            </span>
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default QuickActions;
