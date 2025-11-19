"use client";

import React, { useState, useEffect } from 'react';
import { X, Scan, Camera, Keyboard } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const [manualInput, setManualInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('manual');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      setManualInput('');
    }
  };

  const simulateBarcodeScan = () => {
    // Simulate a barcode scan with one of the mock barcodes
    const mockBarcodes = [
      '1234567890123',
      '2345678901234',
      '3456789012345',
      '4567890123456',
      '5678901234567'
    ];
    const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
    
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onScan(randomBarcode);
    }, 2000);
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Barcode Scanner
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mode Selection */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
            <button
              onClick={() => setScanMode('camera')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                scanMode === 'camera'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Camera size={16} />
              Camera
            </button>
            <button
              onClick={() => setScanMode('manual')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                scanMode === 'manual'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <Keyboard size={16} />
              Manual
            </button>
          </div>

          {scanMode === 'camera' ? (
            <div className="text-center">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 mb-6">
                <Camera size={64} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Camera scanning would be implemented here with a webcam library
                </p>
                <button
                  onClick={simulateBarcodeScan}
                  disabled={isScanning}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors mx-auto ${
                    isScanning
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Scan size={20} />
                  {isScanning ? 'Scanning...' : 'Simulate Scan'}
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                In a real implementation, this would use device camera to scan barcodes
              </p>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter Barcode Manually
                </label>
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Scan or type barcode..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  autoFocus
                />
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Try these sample barcodes:
                </p>
                <div className="space-y-1">
                  {['1234567890123', '2345678901234', '3456789012345'].map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setManualInput(code)}
                      className="block text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {code} (Click to use)
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!manualInput.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;