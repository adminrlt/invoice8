import React, { useState, useEffect } from 'react';
import { FileText, UserPlus, Eye, FileSearch } from 'lucide-react';
import { formatDate } from '../../../utils/date';
import { formatCurrency } from '../../../utils/currency';
import { AssignmentModal } from './AssignmentModal';
import { PdfViewer } from '../../pdf/PdfViewer';
import { useFileAccess } from '../../../hooks/useFileAccess';
import { useInvoiceData } from '../../../hooks/useInvoiceData';
import { useInvoiceAssignment } from '../../../hooks/useInvoiceAssignment';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import type { Invoice } from '../../../types';

interface InvoiceCardProps {
  invoice: Invoice;
  caseNumber: string;
}

interface DocumentInfo {
  vendor_name: string | null;
  invoice_number: string | null;
  invoice_date: string | null;
  total_amount: number | null;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, caseNumber }) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null);

  const { getFileUrl, isLoading: isFileLoading } = useFileAccess();
  const { processInvoice, isLoading: isProcessing } = useInvoiceData(invoice.id, caseNumber);
  const { assignInvoice } = useInvoiceAssignment(invoice.id);

  useEffect(() => {
    const fetchDocumentInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('document_info')
          .select('vendor_name, invoice_number, invoice_date, total_amount')
          .eq('document_id', invoice.id)
          .single();

        if (error) throw error;
        setDocumentInfo(data);
      } catch (error) {
        console.error('Error fetching document info:', error);
      }
    };

    fetchDocumentInfo();

    // Subscribe to changes
    const subscription = supabase
      .channel('document_info_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'document_info',
          filter: `document_id=eq.${invoice.id}`
        },
        () => fetchDocumentInfo()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [invoice.id]);

  const handleViewPdf = async () => {
    try {
      const url = await getFileUrl(invoice.fileUrl);
      if (url) {
        setShowPdfViewer(true);
      }
    } catch (error) {
      console.error('Error opening file:', error);
      toast.error('Failed to open file');
    }
  };

  const handleAssign = async (assignments: { departmentId: string; employeeId: string; }[]) => {
    try {
      const success = await assignInvoice(assignments);
      if (success) {
        setShowAssignModal(false);
        toast.success('Invoice assigned successfully');
      }
    } catch (error: any) {
      console.error('Assignment error:', error);
      toast.error(error.message || 'Failed to assign invoice');
    }
  };

  const handleProcess = async () => {
    await processInvoice(invoice.fileUrl, invoice.pageNumber);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <FileText className="h-5 w-5 text-gray-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {documentInfo?.invoice_number || caseNumber}
            </h3>
            <p className="text-sm text-gray-600">
              {documentInfo?.vendor_name || 'Vendor Pending'}
            </p>
            {documentInfo?.invoice_date && (
              <p className="text-xs text-gray-500">
                {formatDate(documentInfo.invoice_date)}
              </p>
            )}
          </div>
        </div>
        {documentInfo?.total_amount && (
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(documentInfo.total_amount)}
          </span>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setShowAssignModal(true)}
          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Assign
        </button>
        <button
          onClick={handleViewPdf}
          disabled={isFileLoading}
          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </button>
        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <FileSearch className="h-4 w-4 mr-1" />
          Process
        </button>
      </div>

      {showPdfViewer && (
        <PdfViewer
          url={invoice.fileUrl}
          onClose={() => setShowPdfViewer(false)}
        />
      )}

      {showAssignModal && (
        <AssignmentModal
          documentId={invoice.id}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssign}
        />
      )}
    </div>
  );
};