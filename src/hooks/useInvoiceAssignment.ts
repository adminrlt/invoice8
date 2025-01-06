import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { validateDocumentId } from '../utils/validation/document';
import { validateAssignmentData } from '../utils/validation/assignment';
import { verifyFileInStorage } from '../utils/storage/verification';
import toast from 'react-hot-toast';

interface Assignment {
  departmentId: string;
  employeeId: string;
}

export const useInvoiceAssignment = (documentId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);

  const assignInvoice = async (assignments: Assignment[]): Promise<boolean> => {
    console.log('Starting invoice assignment:', { documentId, assignments });

    if (!documentId) {
      console.error('Invalid document ID:', documentId);
      toast.error('Invalid document ID');
      return false;
    }

    if (!validateDocumentId(documentId)) {
      console.error('Document ID validation failed:', documentId);
      toast.error('Invalid document ID format');
      return false;
    }

    // Validate all assignments
    if (!assignments.every(a => validateAssignmentData(a.departmentId, a.employeeId))) {
      console.error('Invalid assignment data:', assignments);
      toast.error('Invalid assignment data');
      return false;
    }

    setIsLoading(true);
    try {
      // Get document info
      const { data: docInfo, error: docError } = await supabase
        .from('document_info')
        .select('id, file_url')
        .eq('document_id', documentId)
        .maybeSingle();

      if (docError) {
        console.error('Error fetching document info:', docError);
        throw docError;
      }
      
      if (!docInfo?.id) {
        console.error('Document info not found:', { documentId });
        throw new Error('Document information not found');
      }

      console.log('Document info found:', docInfo);

      // Verify file exists in cases bucket
      const fileExists = await verifyFileInStorage('cases', docInfo.file_url);
      if (!fileExists) {
        console.error('File not found in cases storage:', docInfo.file_url);
        throw new Error('Document not found in cases storage');
      }

      console.log('File verified in cases storage');

      // Create assignments
      const { error: assignError } = await supabase
        .from('invoice_assignments')
        .insert(
          assignments.map(a => ({
            document_id: documentId,
            document_info_id: docInfo.id,
            department_id: a.departmentId,
            employee_id: a.employeeId,
            status: 'pending',
            assigned_at: new Date().toISOString()
          }))
        );

      if (assignError) {
        console.error('Assignment error:', assignError);
        throw assignError;
      }

      console.log('Assignments created successfully');
      return true;
    } catch (error: any) {
      console.error('Assignment process error:', error);
      toast.error(error.message || 'Failed to assign invoice');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    assignInvoice,
    isLoading
  };
};