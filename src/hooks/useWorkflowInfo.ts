import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface WorkflowInfo {
  departmentName: string;
  employeeName: string;
  assignedAt: string;
  status: string;
}

export const useWorkflowInfo = (documentId: string | undefined) => {
  const [workflowInfo, setWorkflowInfo] = useState<WorkflowInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) return;

    const fetchWorkflowInfo = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('invoice_assignments')
          .select(`
            status,
            assigned_at,
            departments:department_id(name),
            employees:employee_id(name)
          `)
          .eq('document_id', documentId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No assignment found
            setWorkflowInfo(null);
            return;
          }
          throw error;
        }

        if (data) {
          setWorkflowInfo({
            departmentName: data.departments?.name || '',
            employeeName: data.employees?.name || '',
            assignedAt: data.assigned_at,
            status: data.status
          });
        }
      } catch (error: any) {
        console.error('Error fetching workflow info:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflowInfo();

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
        () => fetchWorkflowInfo()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [documentId]);

  return { workflowInfo, isLoading, error };
};