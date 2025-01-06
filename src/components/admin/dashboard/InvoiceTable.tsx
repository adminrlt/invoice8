import React, { useState } from 'react';
import { formatDate } from '../../../utils/date';
import { formatCurrency } from '../../../utils/currency';
import { FileText, UserCheck, CheckCircle, XCircle } from 'lucide-react';
import { useInvoiceActions } from '../../../hooks/useInvoiceActions';
import type { DashboardInvoice } from '../../../types/dashboard';

interface InvoiceTableProps {
  invoices: DashboardInvoice[];
  isLoading: boolean;
  onStatusUpdate: () => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({ 
  invoices, 
  isLoading,
  onStatusUpdate
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const { updateInvoiceStatus, isLoading: isUpdating } = useInvoiceActions();

  const handleAction = async (invoiceId: string, status: 'approved' | 'rejected') => {
    if (await updateInvoiceStatus(invoiceId, status, comment)) {
      setSelectedInvoice(null);
      setComment('');
      onStatusUpdate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!invoices.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No invoices found matching the filters
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Invoice Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assignment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <React.Fragment key={invoice.id}>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.caseNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.vendorName}
                      </div>
                      {invoice.invoiceDate && (
                        <div className="text-xs text-gray-400">
                          {formatDate(invoice.invoiceDate)}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <UserCheck className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-900">
                        {invoice.departmentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.employeeName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    invoice.status === 'approved' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                  {formatCurrency(invoice.totalAmount)}
                </td>
                <td className="px-6 py-4 text-right">
                  {invoice.status === 'pending' && (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedInvoice(invoice.id)}
                        className="text-sm text-indigo-600 hover:text-indigo-900"
                      >
                        Review
                      </button>
                    </div>
                  )}
                </td>
              </tr>
              {selectedInvoice === invoice.id && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 bg-gray-50">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Comment
                        </label>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          rows={3}
                          placeholder="Add a comment (optional)"
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setSelectedInvoice(null)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAction(invoice.id, 'rejected')}
                          disabled={isUpdating}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          <XCircle className="h-4 w-4 inline-block mr-1" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleAction(invoice.id, 'approved')}
                          disabled={isUpdating}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          <CheckCircle className="h-4 w-4 inline-block mr-1" />
                          Approve
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};