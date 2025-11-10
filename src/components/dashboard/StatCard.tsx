import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  subtitleColor: string;
  icon: React.ReactNode;
  iconBg: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  subtitleColor,
  icon,
  iconBg,
}) => (
  <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div className="min-w-0 flex-1 mr-3">
        <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{title}</p>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1 break-all">{value}</p>
      </div>
      <div className={`p-2 sm:p-3 rounded-full ${iconBg} flex-shrink-0`}>{icon}</div>
    </div>
    <p className={`text-xs sm:text-sm mt-2 sm:mt-3 ${subtitleColor} truncate`}>{subtitle}</p>
  </div>
);

export default StatCard;
