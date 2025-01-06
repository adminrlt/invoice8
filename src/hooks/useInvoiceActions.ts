import { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useInvoiceActions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateInvoiceStatus = async (
    assignmentId: string,
    status: 'approved' | 'rejected',
    comment?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('invoice_assignments')
        .update({
          status,
          comments: comment ? [comment] : undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', assignmentId);

      if (error) throw error;
      
      toast.success(`Invoice ${status} successfully`);
      return true;
    } catch (error: any) {
      console.error('Error updating invoice status:', error);
      toast.error(error.message || `Failed to ${status} invoice`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateInvoiceStatus,
    isLoading
  };
};