import { formatCurrency } from '../../../lib/utils';

interface MetricsListItem {
  id: string | number;
  label: string;
  value: string | number;
  subtitle?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  badge?: string;
}

interface MetricsListProps {
  title: string;
  items: MetricsListItem[];
  className?: string;
}

const statusColors = {
  success: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300',
  warning: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300',
  error: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300',
  info: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300'
};

export function MetricsList({ title, items, className = "" }: MetricsListProps) {
  const formatValue = (value: string | number) => {
    if (typeof value === 'number') {
      // Check if it looks like currency (has decimals or is large)
      if (value % 1 !== 0 || value > 1000) {
        return formatCurrency(value);
      }
      return value.toLocaleString();
    }
    return value;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
              {item.subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.subtitle}</p>
              )}
            </div>
            <div className="text-right flex items-center space-x-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatValue(item.value)}
                </p>
                {item.badge && (
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    item.status ? statusColors[item.status] : statusColors.info
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}