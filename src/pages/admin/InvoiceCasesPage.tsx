import React from 'react';
import { useInvoiceNavigation } from '../../hooks/useInvoiceNavigation';
import { CaseList } from '../../components/admin/invoices/CaseList';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const InvoiceCasesPage = () => {
  const { invoices, isLoading, error } = useInvoiceNavigation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        {error}
      </div>
    );
  }

  // Group invoices by case number
  const groupedInvoices = invoices.reduce((acc, invoice) => {
    const { caseNumber } = invoice;
    if (!acc[caseNumber]) {
      acc[caseNumber] = [];
    }
    acc[caseNumber].push(invoice);
    return acc;
  }, {} as Record<string, typeof invoices>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Invoice Cases</h1>
      {Object.keys(groupedInvoices).length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
          No invoice cases found
        </div>
      ) : (
        <CaseList cases={groupedInvoices} />
      )}
    </div>
  );
};