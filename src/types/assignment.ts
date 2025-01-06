export interface InvoiceAssignment {
  id: string;
  document_id: string;
  document_info_id: string;
  department_id: string;
  employee_id: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string[];
  assigned_at: string;
  updated_at: string;
}