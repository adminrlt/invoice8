import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { InvoiceFilters, DashboardInvoice, InvoiceStats } from '../types/dashboard';

export const useInvoiceDashboard = () => {
  const [invoices, setInvoices] = useState<DashboardInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<InvoiceStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });
  const [filters, setFilters] = useState<InvoiceFilters>({
    search: '',
    departmentId: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Build the base query with proper joins and distinct selection
      let query = supabase
        .from('documents')
        .select(`
          id,
          case_number,
          document_info:document_info!inner (
            invoice_number,
            vendor_name,
            invoice_date,
            total_amount
          ),
          invoice_assignments:invoice_assignments!inner (
            id,
            status,
            departments:department_id (
              name
            ),
            employees:employee_id (
              name
            )
          )
        `)
        .order('case_number', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(
          `document_info.invoice_number.ilike.%${filters.search}%,` +
          `document_info.vendor_name.ilike.%${filters.search}%,` +
          `case_number.ilike.%${filters.search}%`
        );
      }

      if (filters.departmentId) {
        query = query.eq('invoice_assignments.department_id', filters.departmentId);
      }

      if (filters.status) {
        query = query.eq('invoice_assignments.status', filters.status);
      }

      if (filters.dateFrom) {
        query = query.gte('document_info.invoice_date', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('document_info.invoice_date', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to ensure unique entries
      const transformedData: DashboardInvoice[] = (data || []).map(item => ({
        id: item.invoice_assignments[0].id,
        documentId: item.id,
        invoiceNumber: item.document_info[0]?.invoice_number || `Case-${item.case_number}`,
        vendorName: item.document_info[0]?.vendor_name || 'Unknown',
        invoiceDate: item.document_info[0]?.invoice_date || '',
        totalAmount: item.document_info[0]?.total_amount || 0,
        departmentName: item.invoice_assignments[0]?.departments?.name || 'Unassigned',
        employeeName: item.invoice_assignments[0]?.employees?.name || 'Unassigned',
        status: item.invoice_assignments[0]?.status || 'pending',
        caseNumber: item.case_number
      }));

      setInvoices(transformedData);

      // Calculate stats
      const pending = transformedData.filter(d => d.status === 'pending').length;
      const approved = transformedData.filter(d => d.status === 'approved').length;
      const rejected = transformedData.filter(d => d.status === 'rejected').length;

      setStats({
        pending,
        approved,
        rejected,
        total: transformedData.length
      });
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscription for both tables
    const subscription = supabase
      .channel('invoice_dashboard_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'invoice_assignments'
        },
        () => fetchData()
      )
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_info'
        },
        () => fetchData()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [filters]);

  return {
    invoices,
    filters,
    setFilters,
    isLoading,
    stats,
    refreshData: fetchData
  };
};