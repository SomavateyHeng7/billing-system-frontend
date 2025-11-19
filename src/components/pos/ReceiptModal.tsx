"use client";

import React, { useRef } from 'react';
import { X, Printer, Mail, Download } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  insuranceNumber?: string;
  insuranceProvider?: string;
  dateOfBirth?: string;
  address?: string;
}

interface CartItem {
  id: string;
  name: string;
  barcode: string;
  price: number;
  quantity: number;
  type: 'prescription' | 'otc' | 'service' | 'procedure' | 'consultation';
  category: 'pharmacy' | 'hospital';
  dosage?: string;
  manufacturer?: string;
  expiryDate?: string;
  batchNumber?: string;
  serviceType?: string;
  department?: string;
  duration?: string;
}

interface Transaction {
  id: string;
  date: string;
  time: string;
  patient?: Patient;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  cashierName: string;
  pharmacistName?: string;
  notes?: string;
  billingType: 'pharmacy' | 'hospital';
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: Transaction;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, receipt }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt - ${receipt.id}</title>
              <style>
                body { font-family: monospace; margin: 20px; }
                .receipt { max-width: 400px; margin: 0 auto; }
              </style>
            </head>
            <body>
              <div class="receipt">
                ${receiptRef.current.innerHTML}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  const handleEmail = () => {
    const emailSubject = `Receipt - ${receipt.id}`;
    const emailBody = `Thank you for your business! Your receipt ID is ${receipt.id}.`;
    const mailtoUrl = `mailto:${receipt.patient?.email || ''}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl);
  };

  const handleDownload = () => {
    // This would typically generate a PDF - for now, we'll just log
    console.log('PDF download functionality would be implemented here');
    alert('PDF download feature will be implemented with a PDF library');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Receipt Generated
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Receipt Content */}
          <div 
            ref={receiptRef}
            className="bg-white border border-gray-300 p-6 mb-6 font-mono text-sm max-w-md mx-auto"
          >
            <div className="text-center border-b border-dashed pb-4 mb-4">
              <h3 className="text-lg font-bold">
                {receipt.billingType === 'pharmacy' ? 'PHARMACY RECEIPT' : 'HOSPITAL BILLING RECEIPT'}
              </h3>
              <div className="text-xs mt-2">
                <div>Receipt ID: {receipt.id}</div>
                <div>{receipt.date} {receipt.time}</div>
              </div>
            </div>

            {receipt.patient && (
              <div className="mb-4 border-b border-dashed pb-4">
                <div className="text-xs">
                  <div className="font-bold">PATIENT INFORMATION</div>
                  <div>Name: {receipt.patient.name}</div>
                  <div>Phone: {receipt.patient.phone}</div>
                  {receipt.patient.email && <div>Email: {receipt.patient.email}</div>}
                  {receipt.patient.insuranceProvider && (
                    <div>Insurance: {receipt.patient.insuranceProvider}</div>
                  )}
                </div>
              </div>
            )}

            <div className="mb-4">
              <div className="text-xs">
                <div>Cashier: {receipt.cashierName}</div>
                {receipt.pharmacistName && (
                  <div>Pharmacist: {receipt.pharmacistName}</div>
                )}
              </div>
            </div>

            <div className="border-b border-dashed pb-4 mb-4">
              {receipt.items.map((item, index) => (
                <div key={index} className="mb-3">
                  <div className="font-bold">{item.name}</div>
                  {item.dosage && (
                    <div className="text-xs text-gray-600">{item.dosage}</div>
                  )}
                  {item.department && (
                    <div className="text-xs text-gray-600">Dept: {item.department}</div>
                  )}
                  {item.duration && (
                    <div className="text-xs text-gray-600">Duration: {item.duration}</div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs">
                      {item.quantity} x ${item.price.toFixed(2)}
                      <span className={`ml-2 px-1 rounded ${
                        item.type === 'prescription' ? 'bg-red-100 text-red-800' :
                        item.type === 'consultation' ? 'bg-blue-100 text-blue-800' :
                        item.type === 'procedure' ? 'bg-purple-100 text-purple-800' :
                        item.type === 'service' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.type === 'prescription' ? 'RX' :
                         item.type === 'consultation' ? 'CONSULT' :
                         item.type === 'procedure' ? 'PROC' :
                         item.type === 'service' ? 'SERVICE' : 'OTC'}
                      </span>
                    </span>
                    <span>${(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                  {item.batchNumber && (
                    <div className="text-xs text-gray-500">Batch: {item.batchNumber}</div>
                  )}
                  {item.expiryDate && (
                    <div className="text-xs text-gray-500">Exp: {item.expiryDate}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-1 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${receipt.subtotal.toFixed(2)}</span>
              </div>
              {receipt.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-${receipt.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${receipt.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-dashed pt-2">
                <span>TOTAL:</span>
                <span>${receipt.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-b border-dashed pb-4 mb-4">
              <div className="text-xs">
                Payment Method: {receipt.paymentMethod}
              </div>
            </div>

            {receipt.items.some(item => item.type === 'prescription') && (
              <div className="bg-red-50 border border-red-200 p-2 mb-4">
                <div className="text-xs text-red-800">
                  ⚠️ PRESCRIPTION ITEMS DISPENSED<br/>
                  Please follow dosage instructions.<br/>
                  Contact pharmacist for questions.
                </div>
              </div>
            )}

            <div className="text-center text-xs">
              Thank you for your business!
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={handleEmail}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Mail size={16} />
              Email
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Download size={16} />
              Download
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;