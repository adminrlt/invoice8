import React from 'react';
import { InvoiceFilters } from './InvoiceFilters';
import { InvoiceTable } from './InvoiceTable';
import { InvoiceStats } from './InvoiceStats';
import { useInvoiceDashboard } from '../../../hooks/useInvoiceDashboard';

export const InvoiceDashboard = () => {
  const {
    invoices,
    filters,
    setFilters,
    isLoading,
    stats,
    refreshData
  } = useInvoiceDashboard();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Invoice Dashboard</h1>
      <InvoiceStats stats={stats} />
      <InvoiceFilters filters={filters} onChange={setFilters} />
      <InvoiceTable 
        invoices={invoices} 
        isLoading={isLoading} 
        onStatusUpdate={refreshData}
      />
    </div>
  );
};