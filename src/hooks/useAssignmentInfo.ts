import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AssignmentInfo {
  departmentName: string;
  employeeName: string;
  assignedAt: string;
  status: string;
}

export const useAssignmentInfo = (documentId: string | undefined) => {
  const [assignmentInfo, setAssignmentInfo] = useState<AssignmentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) {
      setAssignmentInfo(null);
      setIsLoading(false);
      return;
    }

    const fetchAssignmentInfo = async () => {
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
          console.error('Assignment fetch error:', error);
          if (error.code !== 'PGRST116') { // Not found is not an error
            throw error;
          }
        } else if (data) {
          setAssignmentInfo({
            departmentName: data.departments?.name || '',
            employeeName: data.employees?.name || '',
            assignedAt: data.assigned_at,
            status: data.status
          });
        }
      } catch (error: any) {
        console.error('Error fetching assignment info:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignmentInfo();

    // Subscribe to changes
    const subscription = supabase
      .channel('invoice_assignments_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'invoice_assignments',
          filter: `document_id=eq.${documentId}`
        },
        () => fetchAssignmentInfo()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [documentId]);

  return { assignmentInfo, isLoading, error };
};