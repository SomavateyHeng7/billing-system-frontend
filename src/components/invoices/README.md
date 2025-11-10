# Invoice Components

This directory contains reusable components for invoice management functionality extracted from the invoice pages. These components promote code reusability and consistency across the billing system.

## Components Overview

### 1. PatientSearchSelector
A searchable dropdown component for patient selection.

**Features:**
- Real-time search by patient name or phone
- Dark mode support
- Error handling and validation
- Disabled state support
- Required field indicator

**Usage:**
```tsx
import { PatientSearchSelector } from '@/components/invoices';

<PatientSearchSelector
  patients={patients}
  selectedPatient={selectedPatient}
  onPatientSelect={handlePatientSelect}
  placeholder="Search and select patient..."
  error={errors.patient}
  required={true}
/>
```

### 2. ServiceSearchModal
A modal dialog for searching and selecting medical services/procedures.

**Features:**
- Modal overlay with backdrop
- Real-time search by code, description, or category
- Service categorization
- Price display
- Dark mode support

**Usage:**
```tsx
import { ServiceSearchModal } from '@/components/invoices';

<ServiceSearchModal
  isOpen={showServiceSearch}
  onClose={() => setShowServiceSearch(false)}
  services={services}
  onServiceSelect={handleServiceSelect}
  title="Select Service/Procedure"
/>
```

### 3. LineItemsTable
A comprehensive table component for managing invoice line items.

**Features:**
- Inline editing for quantities, prices, and descriptions
- Add/remove line items
- Automatic total calculations
- Empty state handling
- Read-only mode support
- Dark mode support

**Usage:**
```tsx
import { LineItemsTable } from '@/components/invoices';

<LineItemsTable
  lineItems={invoice.lineItems}
  onUpdateLineItem={updateLineItem}
  onRemoveLineItem={removeLineItem}
  isEditable={true}
  showActions={true}
  error={errors.lineItems}
/>
```

### 4. InvoiceTotalsCalculator
A component for calculating and displaying invoice totals with optional editing.

**Features:**
- Automatic subtotal, tax, and total calculations
- Editable discount and tax rate
- Summary statistics
- Dark mode support
- Read-only display mode

**Usage:**
```tsx
import { InvoiceTotalsCalculator } from '@/components/invoices';

<InvoiceTotalsCalculator
  lineItems={invoice.lineItems}
  discountAmount={invoice.discountAmount}
  taxRate={invoice.taxRate}
  onDiscountChange={handleDiscountChange}
  onTaxRateChange={handleTaxRateChange}
  isEditable={true}
/>
```

### 5. InvoiceSummaryCard
A card component displaying patient, facility, and invoice information.

**Features:**
- Patient and facility information display
- Invoice dates and status
- Balance due highlighting
- Status badge with color coding
- Dark mode support

**Usage:**
```tsx
import { InvoiceSummaryCard } from '@/components/invoices';

<InvoiceSummaryCard
  patient={invoice.patient}
  facility={invoice.facility}
  dates={{ dateIssued: invoice.dateIssued, dueDate: invoice.dueDate }}
  balanceDue={invoice.balanceDue}
  status={invoice.status}
/>
```

### 6. PaymentModal
A modal component for recording payments against invoices.

**Features:**
- Payment amount validation
- Multiple payment methods
- Reference number and notes
- Form validation
- Dark mode support
- Maximum amount enforcement

**Usage:**
```tsx
import { PaymentModal } from '@/components/invoices';

<PaymentModal
  isOpen={showPaymentModal}
  onClose={() => setShowPaymentModal(false)}
  maxAmount={invoice.balanceDue}
  onPaymentSubmit={handlePaymentSubmit}
  title="Record Payment"
/>
```

## TypeScript Interfaces

The components use shared TypeScript interfaces for type safety:

```tsx
interface LineItem {
  id: string;
  serviceCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
}

interface Patient {
  id: number;
  name: string;
  phone: string;
  insurance: string;
  email?: string;
  address?: string;
  insuranceId?: string;
}

interface Service {
  code: string;
  description: string;
  price: number;
  category: string;
}
```

## Best Practices

1. **State Management**: Each component manages its own internal state while communicating changes through callback props.

2. **Accessibility**: All components include proper ARIA labels, keyboard navigation, and screen reader support.

3. **Dark Mode**: All components support dark mode using Tailwind's dark mode classes.

4. **Validation**: Components include built-in validation with error display.

5. **Performance**: Components are optimized with proper React hooks usage and minimal re-renders.

## Integration Examples

### Complete Invoice Form
```tsx
import {
  PatientSearchSelector,
  ServiceSearchModal,
  LineItemsTable,
  InvoiceTotalsCalculator,
  PaymentModal
} from '@/components/invoices';

function InvoiceForm() {
  // State management...

  return (
    <div className="space-y-6">
      {/* Patient Selection */}
      <PatientSearchSelector
        patients={patients}
        selectedPatient={selectedPatient}
        onPatientSelect={setSelectedPatient}
        required={true}
      />

      {/* Line Items */}
      <LineItemsTable
        lineItems={lineItems}
        onUpdateLineItem={updateLineItem}
        onRemoveLineItem={removeLineItem}
      />

      {/* Totals */}
      <InvoiceTotalsCalculator
        lineItems={lineItems}
        discountAmount={discount}
        taxRate={taxRate}
        onDiscountChange={setDiscount}
        onTaxRateChange={setTaxRate}
      />

      {/* Service Modal */}
      <ServiceSearchModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        services={services}
        onServiceSelect={addLineItem}
      />
    </div>
  );
}
```

## Migration from Existing Code

To migrate existing invoice pages to use these components:

1. **Install components**: Import the desired components from `@/components/invoices`
2. **Replace inline code**: Remove the equivalent code from your pages
3. **Update state management**: Ensure your state structure matches the component interfaces
4. **Test functionality**: Verify all features work as expected

## Future Enhancements

Potential improvements for these components:

1. **Form validation library**: Integration with libraries like react-hook-form or formik
2. **Data persistence**: Automatic saving of form state
3. **Print formatting**: Print-optimized layouts
4. **Export functionality**: PDF/Excel export capabilities
5. **Internationalization**: Multi-language support
6. **Advanced filtering**: More sophisticated search and filter options

## Contributing

When adding new features or modifying existing components:

1. Maintain TypeScript interfaces
2. Include proper error handling
3. Add dark mode support
4. Update this documentation
5. Add unit tests for new functionality
6. Ensure accessibility standards are met