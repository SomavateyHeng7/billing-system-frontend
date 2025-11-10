import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: {
    value: number;
    period: string;
    icon?: React.ReactNode;
  };
  icon: LucideIcon;
  iconColor?: string;
  valueColor?: string;
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-blue-600",
  valueColor = "text-gray-900 dark:text-white",
  subtitle
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold ${valueColor}`}>
            {value}
          </p>
          {change && (
            <div className="flex items-center space-x-1 mt-1">
              {change.icon}
              <span className="text-sm text-green-600">
                +{change.value}% {change.period}
              </span>
            </div>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <Icon className={`h-8 w-8 ${iconColor}`} />
      </div>
    </div>
  );
}