interface ProgressBarProps {
  label: string;
  value: number;
  maxValue?: number;
  percentage?: number;
  showValue?: boolean;
  showPercentage?: boolean;
  barColor?: string;
  backgroundColor?: string;
  className?: string;
}

export function ProgressBar({
  label,
  value,
  maxValue,
  percentage,
  showValue = true,
  showPercentage = false,
  barColor = "bg-blue-600",
  backgroundColor = "bg-gray-200 dark:bg-gray-700",
  className = ""
}: ProgressBarProps) {
  const calculatedPercentage = percentage || (maxValue ? (value / maxValue) * 100 : 0);
  
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
        <div className="flex items-center space-x-2">
          {showValue && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({calculatedPercentage.toFixed(1)}%)
            </span>
          )}
        </div>
      </div>
      <div className={`w-full ${backgroundColor} rounded-full h-2`}>
        <div
          className={`${barColor} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${calculatedPercentage}%` }}
        />
      </div>
    </div>
  );
}