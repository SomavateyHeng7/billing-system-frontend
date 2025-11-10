'use client';

interface InvoiceTotalsProps {
  lineItems: Array<{ total: number }>;
  discountAmount?: number;
  taxRate?: number;
  showDiscountField?: boolean;
  showTaxField?: boolean;
  onDiscountChange?: (value: number) => void;
  onTaxRateChange?: (value: number) => void;
  isEditable?: boolean;
  className?: string;
}

export default function InvoiceTotalsCalculator({
  lineItems,
  discountAmount = 0,
  taxRate = 0,
  showDiscountField = true,
  showTaxField = true,
  onDiscountChange,
  onTaxRateChange,
  isEditable = true,
  className = ""
}: InvoiceTotalsProps) {
  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() - discountAmount) * (taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - discountAmount + calculateTax();
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax();
  const total = calculateTotal();

  return (
    <div className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Invoice Totals</h3>
      
      <div className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-300">Subtotal:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        {/* Discount */}
        {showDiscountField && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300">Discount:</span>
            {isEditable && onDiscountChange ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={subtotal}
                  value={discountAmount}
                  onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-right"
                />
              </div>
            ) : (
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                -${discountAmount.toFixed(2)}
              </span>
            )}
          </div>
        )}

        {/* Tax */}
        {showTaxField && (
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Tax</span>
              {isEditable && onTaxRateChange ? (
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-500">(</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={taxRate}
                    onChange={(e) => onTaxRateChange(parseFloat(e.target.value) || 0)}
                    className="w-12 px-1 py-0.5 text-xs border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-center"
                  />
                  <span className="text-sm text-gray-500">%):</span>
                </div>
              ) : (
                <span className="text-sm text-gray-500">({taxRate}%):</span>
              )}
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              ${tax.toFixed(2)}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-gray-900 dark:text-white">Total:</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Summary stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Items</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {lineItems.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Average per Item</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ${lineItems.length > 0 ? (subtotal / lineItems.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}