import { LucideIcon } from 'lucide-react';

interface ReportOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface TimeframeOption {
  value: string;
  label: string;
}

interface ReportControlsProps {
  reports: ReportOption[];
  timeframes: TimeframeOption[];
  selectedReport: string;
  selectedTimeframe: string;
  onReportChange: (report: string) => void;
  onTimeframeChange: (timeframe: string) => void;
}

export function ReportControls({
  reports,
  timeframes,
  selectedReport,
  selectedTimeframe,
  onReportChange,
  onTimeframeChange
}: ReportControlsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        {/* Report Type Selection */}
        <div className="flex flex-wrap gap-2">
          {reports.map(report => (
            <button
              key={report.value}
              onClick={() => onReportChange(report.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedReport === report.value
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <report.icon className="h-4 w-4" />
              <span>{report.label}</span>
            </button>
          ))}
        </div>

        {/* Timeframe Selection */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Timeframe:</span>
          <select
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedTimeframe}
            onChange={(e) => onTimeframeChange(e.target.value)}
          >
            {timeframes.map(timeframe => (
              <option key={timeframe.value} value={timeframe.value}>
                {timeframe.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}