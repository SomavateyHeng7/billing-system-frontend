'use client';

import { useState } from 'react';
import { UserIcon } from 'lucide-react';

interface Patient {
  id: number;
  name: string;
  phone: string;
  insurance: string;
}

interface PatientSearchSelectorProps {
  patients: Patient[];
  selectedPatient?: Patient | null;
  onPatientSelect: (patient: Patient) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function PatientSearchSelector({
  patients,
  selectedPatient,
  onPatientSelect,
  placeholder = "Search and select patient...",
  error,
  disabled = false,
  required = false
}: PatientSearchSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handlePatientSelect = (patient: Patient) => {
    onPatientSelect(patient);
    setShowDropdown(false);
    setSearchTerm('');
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setShowDropdown(true);
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Patient {required && '*'}
      </label>
      
      <input
        type="text"
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
          error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
        } ${disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}`}
        value={selectedPatient?.name || searchTerm}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleInputFocus}
      />

      {showDropdown && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredPatients.length > 0 ? (
            filteredPatients.map(patient => (
              <div
                key={patient.id}
                className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                onClick={() => handlePatientSelect(patient)}
              >
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{patient.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{patient.insurance} • {patient.phone}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
              No patients found
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}