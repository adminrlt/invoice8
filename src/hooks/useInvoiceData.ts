import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { processInvoiceWithAzure } from '../lib/api/azure/invoiceProcessor';
import { validateDocumentId, validateFileUrl, validatePageNumber, normalizeFileUrl } from '../utils/validation/document';
import toast from 'react-hot-toast';

export const useInvoiceData = (documentId: string | undefined, caseNumber: string) => {
  const [isLoading, setIsLoading] = useState(false);

  const processInvoice = async (fileUrl: string, pageNumber: number) => {
    // Validate inputs
    if (!validateDocumentId(documentId)) {
      toast.error('Invalid document ID');
      return;
    }

    if (!validateFileUrl(fileUrl)) {
      toast.error('Invalid file URL');
      return;
    }

    if (!validatePageNumber(pageNumber)) {
      toast.error('Invalid page number');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Processing invoice...');

    try {
      // Normalize the file URL
      const normalizedUrl = normalizeFileUrl(fileUrl);

      // Verify file exists in storage
      const { data: fileExists } = await supabase.storage
        .from('cases')
        .list(normalizedUrl.split('/').slice(0, -1).join('/'), {
          limit: 1,
          search: normalizedUrl.split('/').pop()
        });

      if (!fileExists?.length) {
        throw new Error('File not found in storage');
      }

      // Process the invoice
      await processInvoiceWithAzure(documentId, caseNumber, normalizedUrl, pageNumber);
      
      toast.success('Invoice processed successfully', { id: toastId });
    } catch (error: any) {
      console.error('Error processing invoice:', error);
      toast.error(error.message || 'Failed to process invoice', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    processInvoice,
    isLoading
  };
};