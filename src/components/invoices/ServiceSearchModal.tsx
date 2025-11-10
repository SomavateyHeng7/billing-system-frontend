'use client';

import { useState } from 'react';
import { SearchIcon, PlusIcon, XIcon } from 'lucide-react';

interface Service {
  code: string;
  description: string;
  price: number;
  category: string;
}

interface ServiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  onServiceSelect: (service: Service) => void;
  title?: string;
}

export default function ServiceSearchModal({
  isOpen,
  onClose,
  services,
  onServiceSelect,
  title = "Select Service/Procedure"
}: ServiceSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredServices = services.filter(service =>
    service.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleServiceSelect = (service: Service) => {
    onServiceSelect(service);
    setSearchTerm('');
    onClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-96 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by code, description, or category..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-80 p-4">
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {filteredServices.map(service => (
                <div
                  key={service.code}
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border border-gray-200 dark:border-gray-600 rounded-lg transition-colors"
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{service.code}</span>
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full">
                          {service.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">${service.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {searchTerm ? 'No services found matching your search' : 'No services available'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}