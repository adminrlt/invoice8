import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { Invoice } from '../types';

export const useInvoiceNavigation = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select(`
            id,
            case_number,
            file_urls,
            created_at,
            document_info:document_info(
              vendor_name,
              invoice_number,
              invoice_date,
              total_amount,
              processing_status,
              error_message,
              file_url
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform the data
        const transformedInvoices = data
          .filter(doc => doc.case_number) // Only include documents with case numbers
          .map(doc => {
            const docInfo = doc.document_info?.[0];
            return {
              id: doc.id,
              caseNumber: doc.case_number,
              fileUrl: docInfo?.file_url || doc.file_urls[0],
              pageNumber: 1,
              invoiceNumber: docInfo?.invoice_number,
              vendorName: docInfo?.vendor_name,
              invoiceDate: docInfo?.invoice_date,
              totalAmount: docInfo?.total_amount,
              status: docInfo?.processing_status,
              error_message: docInfo?.error_message,
              createdAt: doc.created_at
            };
          });

        setInvoices(transformedInvoices);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching invoices:', err);
        setError('Failed to load invoices');
        toast.error('Failed to load invoices');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();

    // Set up real-time subscription
    const subscription = supabase
      .channel('invoice_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'document_info'
        },
        () => fetchInvoices()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { invoices, isLoading, error };
};