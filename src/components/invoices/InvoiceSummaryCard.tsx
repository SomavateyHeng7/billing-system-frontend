'use client';

import { UserIcon, PhoneIcon, MapPinIcon, MailIcon, CalendarIcon, ClockIcon, DollarSignIcon } from 'lucide-react';

interface Patient {
  name: string;
  email: string;
  phone: string;
  address: string;
  insurance: string;
  insuranceId: string;
}

interface Facility {
  name: string;
  provider: string;
  address: string;
  phone: string;
}

interface InvoiceDates {
  dateIssued: string;
  dueDate: string;
}

interface InvoiceSummaryCardProps {
  patient: Patient;
  facility: Facility;
  dates: InvoiceDates;
  balanceDue?: number;
  status?: string;
  className?: string;
}

export default function InvoiceSummaryCard({
  patient,
  facility,
  dates,
  balanceDue,
  status,
  className = ""
}: InvoiceSummaryCardProps) {
  const getStatusColor = (status?: string) => {
    if (!status) return '';
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'partial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>Patient Information</span>
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Name:</p>
              <p className="text-sm text-gray-900 dark:text-white">{patient.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <MailIcon className="h-4 w-4 text-gray-400" />
              <p className="text-sm text-gray-700 dark:text-gray-300">{patient.email}</p>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="h-4 w-4 text-gray-400" />
              <p className="text-sm text-gray-700 dark:text-gray-300">{patient.phone}</p>
            </div>
            <div className="flex items-start space-x-2">
              <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5" />
              <p className="text-sm text-gray-700 dark:text-gray-300">{patient.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Insurance:</p>
              <p className="text-sm text-gray-900 dark:text-white">{patient.insurance}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Policy ID: {patient.insuranceId}</p>
            </div>
          </div>
        </div>

        {/* Facility Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Facility Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Facility:</p>
              <p className="text-sm text-gray-900 dark:text-white">{facility.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Provider:</p>
              <p className="text-sm text-gray-900 dark:text-white">{facility.provider}</p>
            </div>
            <div className="flex items-start space-x-2">
              <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5" />
              <p className="text-sm text-gray-700 dark:text-gray-300">{facility.address}</p>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="h-4 w-4 text-gray-400" />
              <p className="text-sm text-gray-700 dark:text-gray-300">{facility.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Dates and Status */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Date Issued</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(dates.dateIssued).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Due Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(dates.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            {balanceDue !== undefined && (
              <div className="flex items-center space-x-2">
                <DollarSignIcon className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Balance Due</p>
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                    ${balanceDue.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {status && (
            <div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}