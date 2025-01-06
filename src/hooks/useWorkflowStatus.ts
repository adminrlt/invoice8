import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface WorkflowStatus {
  status: 'pending' | 'approved' | 'rejected';
  departmentName: string;
  employeeName: string;
  assignedAt: string;
  comments: string[];
}

export const useWorkflowStatus = (documentId: string | undefined) => {
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) return;

    const fetchWorkflowStatus = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('invoice_assignments')
          .select(`
            status,
            assigned_at,
            comments,
            departments:department_id(name),
            employees:employee_id(name)
          `)
          .eq('document_id', documentId)
          .single();

        if (error) throw error;

        if (data) {
          setWorkflowStatus({
            status: data.status,
            departmentName: data.departments?.name || '',
            employeeName: data.employees?.name || '',
            assignedAt: data.assigned_at,
            comments: data.comments || []
          });
        }
      } catch (error: any) {
        console.error('Error fetching workflow status:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflowStatus();

    // Subscribe to changes
    const subscription = supabase
      .channel('workflow_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'invoice_assignments',
          filter: `document_id=eq.${documentId}`
        },
        () => fetchWorkflowStatus()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [documentId]);

  return { workflowStatus, isLoading, error };
};