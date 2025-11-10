// Invoice Components
export { default as PatientSearchSelector } from './PatientSearchSelector';
export { default as ServiceSearchModal } from './ServiceSearchModal';
export { default as LineItemsTable } from './LineItemsTable';
export { default as InvoiceTotalsCalculator } from './InvoiceTotalsCalculator';
export { default as InvoiceSummaryCard } from './InvoiceSummaryCard';
export { default as PaymentModal } from './PaymentModal';

// Types (could be moved to a separate types file)
export interface LineItem {
  id: string;
  serviceCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
}

export interface Patient {
  id: number;
  name: string;
  phone: string;
  insurance: string;
  email?: string;
  address?: string;
  insuranceId?: string;
}

export interface Service {
  code: string;
  description: string;
  price: number;
  category: string;
}

export interface PaymentHistoryItem {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference?: string;
  status: string;
  notes?: string;
}