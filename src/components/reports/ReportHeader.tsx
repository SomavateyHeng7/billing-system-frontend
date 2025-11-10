import Link from 'next/link';
import { ArrowLeftIcon, BarChart3Icon, DownloadIcon, RefreshCwIcon } from 'lucide-react';

interface ReportHeaderProps {
  onExportReport: () => void;
  onRefreshData?: () => void;
}

export function ReportHeader({ onExportReport, onRefreshData }: ReportHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-3">
                <BarChart3Icon className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Financial insights and business intelligence</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onExportReport}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
              >
                <DownloadIcon className="h-4 w-4" />
                <span>Export Report</span>
              </button>
              <button 
                onClick={onRefreshData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
              >
                <RefreshCwIcon className="h-4 w-4" />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}