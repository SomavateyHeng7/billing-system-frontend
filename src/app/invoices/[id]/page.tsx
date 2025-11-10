'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  EditIcon,
  DownloadIcon,
  MailIcon,
  TrashIcon,
  CreditCardIcon,
  CheckIcon,
  XIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  DollarSignIcon,
  AlertTriangleIcon,
  FileTextIcon,
  PrinterIcon,
  ShareIcon,
  MoreVerticalIcon
} from 'lucide-react';

// Mock invoice data
const mockInvoiceData = {
  '1': {
    id: 'INV-2024-001',
    patientId: 1,
    patientName: 'John Smith',
    patientEmail: 'john.smith@email.com',
    patientPhone: '(555) 123-4567',
    patientAddress: '123 Main St, Anytown, ST 12345',
    insurance: 'Blue Cross Blue Shield',
    insuranceId: 'BC123456789',
    dateIssued: '2024-11-01',
    dueDate: '2024-12-01',
    status: 'Partial',
    provider: 'Dr. Sarah Johnson',
    facility: 'City Medical Center',
    facilityAddress: '456 Healthcare Ave, Medical City, ST 67890',
    facilityPhone: '(555) 987-6543',
    notes: 'Follow-up appointment recommended in 2 weeks. Patient responded well to treatment.',
    lineItems: [
      { id: '1', code: '99213', description: 'Office Visit - Established Patient', quantity: 1, unitPrice: 200.00, total: 200.00 },
      { id: '2', code: '80053', description: 'Comprehensive Metabolic Panel', quantity: 1, unitPrice: 150.00, total: 150.00 },
      { id: '3', code: '85025', description: 'Complete Blood Count', quantity: 1, unitPrice: 100.00, total: 100.00 }
    ],
    subtotal: 450.00,
    discountAmount: 50.00,
    taxRate: 8.5,
    taxAmount: 34.00,
    totalAmount: 434.00,
    amountPaid: 200.00,
    balanceDue: 234.00,
    paymentHistory: [
      {
        id: '1',
        date: '2024-11-05',
        amount: 200.00,
        method: 'Credit Card',
        reference: 'CH_1234567890',
        status: 'Completed'
      }
    ],
    isRecurring: false,
    recurringInterval: null
  },
  '2': {
    id: 'INV-2024-002',
    patientId: 2,
    patientName: 'Sarah Johnson',
    patientEmail: 'sarah.johnson@email.com',
    patientPhone: '(555) 987-6543',
    patientAddress: '789 Oak Street, Hometown, ST 54321',
    insurance: 'Aetna',
    insuranceId: 'AET987654321',
    dateIssued: '2024-10-28',
    dueDate: '2024-11-27',
    status: 'Overdue',
    provider: 'Dr. Michael Chen',
    facility: 'City Medical Center',
    facilityAddress: '456 Healthcare Ave, Medical City, ST 67890',
    facilityPhone: '(555) 987-6543',
    notes: 'Emergency visit for chest pain. All tests came back normal.',
    lineItems: [
      { id: '1', code: '99285', description: 'Emergency Department Visit - High Complexity', quantity: 1, unitPrice: 800.00, total: 800.00 },
      { id: '2', code: '71020', description: 'Chest X-Ray', quantity: 1, unitPrice: 200.00, total: 200.00 }
    ],
    subtotal: 1000.00,
    discountAmount: 0.00,
    taxRate: 8.5,
    taxAmount: 85.00,
    totalAmount: 1085.00,
    amountPaid: 0.00,
    balanceDue: 1085.00,
    paymentHistory: [],
    isRecurring: false,
    recurringInterval: null
  }
};

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
  onPaymentSubmit: (paymentData: any) => void;
}

function PaymentModal({ isOpen, onClose, invoice, onPaymentSubmit }: PaymentModalProps) {
  const [paymentData, setPaymentData] = useState({
    amount: invoice?.balanceDue || 0,
    method: 'credit_card',
    reference: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPaymentSubmit({
      ...paymentData,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Record Payment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                max={invoice?.balanceDue}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={paymentData.amount}
                onChange={(e) => setPaymentData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={paymentData.method}
              onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
              required
            >
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="check">Check</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="insurance">Insurance Payment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Number (Optional)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Check number, Transaction ID"
              value={paymentData.reference}
              onChange={(e) => setPaymentData(prev => ({ ...prev, reference: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Payment notes or comments"
              value={paymentData.notes}
              onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InvoiceDetail() {
  const params = useParams();
  const invoiceId = params.id as string;
  const invoice = mockInvoiceData[invoiceId as keyof typeof mockInvoiceData];

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState(invoice);
  const [showMoreActions, setShowMoreActions] = useState(false);

  if (!invoiceData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h1>
          <p className="text-gray-600 mb-4">The requested invoice could not be found.</p>
          <Link href="/invoices" className="text-blue-600 hover:text-blue-800">
            Return to Invoices
          </Link>
        </div>
      </div>
    );
  }

  const handlePaymentSubmit = (paymentData: any) => {
    const newPayment = {
      id: Date.now().toString(),
      ...paymentData
    };

    const updatedInvoice = {
      ...invoiceData,
      paymentHistory: [...invoiceData.paymentHistory, newPayment],
      amountPaid: invoiceData.amountPaid + paymentData.amount,
      balanceDue: invoiceData.balanceDue - paymentData.amount
    };

    // Update status based on payment
    if (updatedInvoice.balanceDue <= 0) {
      updatedInvoice.status = 'Paid';
    } else if (updatedInvoice.amountPaid > 0) {
      updatedInvoice.status = 'Partial';
    }

    setInvoiceData(updatedInvoice);
    alert('Payment recorded successfully!');
  };

  const handleStatusUpdate = (newStatus: string) => {
    setInvoiceData(prev => ({ ...prev, status: newStatus }));
    setShowMoreActions(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Sent': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPaymentMethod = (method: string) => {
    return method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/invoices" className="text-blue-600 hover:text-blue-800">
                  <ArrowLeftIcon className="h-6 w-6" />
                </Link>
                <div className="flex items-center space-x-3">
                  <FileTextIcon className="h-8 w-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Invoice {invoiceData.id}</h1>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoiceData.status)}`}>
                        {invoiceData.status}
                      </span>
                      <span className="text-sm text-gray-600">
                        Due: {new Date(invoiceData.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                >
                  <CreditCardIcon className="h-4 w-4" />
                  <span>Record Payment</span>
                </button>

                <Link
                  href={`/invoices/${invoiceId}/edit`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                >
                  <EditIcon className="h-4 w-4" />
                  <span>Edit</span>
                </Link>

                <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2">
                  <DownloadIcon className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowMoreActions(!showMoreActions)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-semibold transition-colors duration-200"
                  >
                    <MoreVerticalIcon className="h-4 w-4" />
                  </button>

                  {showMoreActions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => alert('Email sent!')}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <MailIcon className="h-4 w-4" />
                          <span>Send via Email</span>
                        </button>
                        <button
                          onClick={() => alert('Printing...')}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <PrinterIcon className="h-4 w-4" />
                          <span>Print Invoice</span>
                        </button>
                        <button
                          onClick={() => alert('Share options...')}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <ShareIcon className="h-4 w-4" />
                          <span>Share</span>
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={() => handleStatusUpdate('Sent')}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <CheckIcon className="h-4 w-4" />
                          <span>Mark as Sent</span>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate('Overdue')}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <AlertTriangleIcon className="h-4 w-4" />
                          <span>Mark as Overdue</span>
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this invoice?')) {
                              alert('Invoice deleted!');
                            }
                          }}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <TrashIcon className="h-4 w-4" />
                          <span>Delete Invoice</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Invoice Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                    <span>Patient Information</span>
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Name:</span> {invoiceData.patientName}</p>
                    <p className="text-sm flex items-center space-x-1">
                      <MailIcon className="h-4 w-4 text-gray-400" />
                      <span>{invoiceData.patientEmail}</span>
                    </p>
                    <p className="text-sm flex items-center space-x-1">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      <span>{invoiceData.patientPhone}</span>
                    </p>
                    <p className="text-sm flex items-start space-x-1">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span>{invoiceData.patientAddress}</span>
                    </p>
                    <p className="text-sm"><span className="font-medium">Insurance:</span> {invoiceData.insurance}</p>
                    <p className="text-sm"><span className="font-medium">Policy ID:</span> {invoiceData.insuranceId}</p>
                  </div>
                </div>

                {/* Facility Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Facility Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Facility:</span> {invoiceData.facility}</p>
                    <p className="text-sm"><span className="font-medium">Provider:</span> {invoiceData.provider}</p>
                    <p className="text-sm flex items-start space-x-1">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span>{invoiceData.facilityAddress}</span>
                    </p>
                    <p className="text-sm flex items-center space-x-1">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      <span>{invoiceData.facilityPhone}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Invoice Dates */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Date Issued</p>
                      <p className="text-sm font-medium">{new Date(invoiceData.dateIssued).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Due Date</p>
                      <p className="text-sm font-medium">{new Date(invoiceData.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSignIcon className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Balance Due</p>
                      <p className="text-sm font-semibold text-red-600">${invoiceData.balanceDue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Services & Procedures */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Services & Procedures</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoiceData.lineItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-4 text-sm font-medium text-blue-600">{item.code}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{item.description}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="text-sm font-medium">${invoiceData.subtotal.toFixed(2)}</span>
                    </div>
                    {invoiceData.discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Discount:</span>
                        <span className="text-sm font-medium text-red-600">-${invoiceData.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tax ({invoiceData.taxRate}%):</span>
                      <span className="text-sm font-medium">${invoiceData.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="text-base font-semibold">Total:</span>
                      <span className="text-base font-bold">${invoiceData.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Amount Paid:</span>
                      <span className="text-sm font-medium text-green-600">${invoiceData.amountPaid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="text-base font-semibold">Balance Due:</span>
                      <span className="text-base font-bold text-red-600">${invoiceData.balanceDue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoiceData.notes && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{invoiceData.notes}</p>
              </div>
            )}
          </div>

          {/* Payment History Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment History</h3>

              {invoiceData.paymentHistory.length > 0 ? (
                <div className="space-y-4">
                  {invoiceData.paymentHistory.map((payment) => (
                    <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-900">${payment.amount.toFixed(2)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Date:</span> {new Date(payment.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Method:</span> {formatPaymentMethod(payment.method)}
                        </p>
                        {payment.reference && (
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">Reference:</span> {payment.reference}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCardIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No payments recorded</p>
                  <p className="text-gray-400 text-xs mt-1">Click "Record Payment" to add a payment</p>
                </div>
              )}

              {invoiceData.balanceDue > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <CreditCardIcon className="h-4 w-4" />
                    <span>Record Payment</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        invoice={invoiceData}
        onPaymentSubmit={handlePaymentSubmit}
      />
    </div>
  );
}