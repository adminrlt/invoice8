import React from 'react';
import { InvoiceListItem } from './InvoiceListItem';
import type { Invoice } from '../../../types';

interface InvoiceListProps {
  invoices: Invoice[];
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ invoices }) => {
  if (!invoices.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        No invoices found
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {invoices.map((invoice) => (
        <InvoiceListItem
          key={`${invoice.id}-${invoice.pageNumber}`}
          invoice={invoice}
          documentId={invoice.id}
          caseNumber={invoice.caseNumber}
        />
      ))}
    </ul>
  );
};