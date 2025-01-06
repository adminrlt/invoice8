import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronRight, UserPlus, FileSearch, ClipboardList, Loader } from 'lucide-react';
import { formatDate } from '../../../utils/date';
import { useFileAccess } from '../../../hooks/useFileAccess';
import { useInvoiceData } from '../../../hooks/useInvoiceData';
import { useInvoiceAssignment } from '../../../hooks/useInvoiceAssignment';
import { useWorkflowInfo } from '../../../hooks/useWorkflowInfo';
import { InvoiceDetails } from './InvoiceDetails';
import { ProcessingStatus } from './ProcessingStatus';
import { WorkflowDrawer } from './WorkflowDrawer';
import { PdfViewer } from '../../pdf/PdfViewer';
import { AssignmentModal } from './AssignmentModal';
import toast from 'react-hot-toast';
import type { Invoice } from '../../../types';

interface InvoiceListItemProps {
  invoice: Invoice;
  caseNumber: string;
  documentId: string;
}

export const InvoiceListItem: React.FC<InvoiceListItemProps> = ({ 
  invoice, 
  caseNumber,
  documentId 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showWorkflowDrawer, setShowWorkflowDrawer] = useState(false);
  
  const { openFile, getFileUrl, isLoading: isFileLoading } = useFileAccess();
  const { processInvoice, isLoading: isProcessing } = useInvoiceData(documentId, caseNumber);
  const { assignInvoice } = useInvoiceAssignment(documentId);
  const { workflowInfo, isLoading: isWorkflowLoading } = useWorkflowInfo(documentId);

  const handleOpenFile = async () => {
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

  const handleExtractData = async () => {
    await processInvoice(invoice.fileUrl, invoice.pageNumber);
  };

  const handleAssign = async (assignments: Assignment[]) => {
    console.log('Assigning invoice:', { documentId, assignments });
    
    if (!documentId) {
      console.error('Invalid document ID:', documentId);
      toast.error('Invalid document ID');
      return;
    }

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

  const handleWorkflowClick = () => {
    setShowWorkflowDrawer(true);
  };

  return (
    <li className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Rest of the component remains the same */}
      
      {showAssignModal && (
        <AssignmentModal
          documentId={documentId}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssign}
        />
      )}
    </li>
  );
};