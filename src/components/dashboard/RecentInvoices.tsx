import React from 'react';

interface Invoice {
  id: string;
  patient: string;
  amount: number;
  status: string;
  date: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'text-green-600 bg-green-100';
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'overdue':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const RecentInvoices: React.FC<{ invoices: Invoice[] }> = ({ invoices }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Recent Invoices</h2>
      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
        View All
      </button>
    </div>
    
    {/* Mobile Card View */}
    <div className="block sm:hidden">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{invoice.id}</span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  invoice.status
                )}`}
              >
                {invoice.status}
              </span>
            </div>
            <div className="text-sm text-gray-900 dark:text-white font-medium mb-1">{invoice.patient}</div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-900 dark:text-white font-semibold">
                ${invoice.amount.toLocaleString()}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {new Date(invoice.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Desktop Table View */}
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {['Invoice ID', 'Patient', 'Amount', 'Status', 'Date'].map((head) => (
              <th
                key={head}
                className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                {invoice.id}
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {invoice.patient}
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${invoice.amount.toLocaleString()}
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    invoice.status
                  )}`}
                >
                  {invoice.status}
                </span>
              </td>
              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(invoice.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RecentInvoices;
