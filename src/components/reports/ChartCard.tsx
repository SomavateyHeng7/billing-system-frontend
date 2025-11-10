import { LucideIcon } from 'lucide-react';

interface ChartCardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ 
  title, 
  icon: Icon, 
  children, 
  className = "" 
}: ChartCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {Icon && <Icon className="h-5 w-5 text-gray-400" />}
      </div>
      {children}
    </div>
  );
}