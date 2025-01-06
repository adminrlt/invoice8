export interface InvoiceFilters {
  search: string;
  departmentId: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

export interface DashboardInvoice {
  id: string;
  documentId: string;
  invoiceNumber: string;
  vendorName: string;
  invoiceDate: string;
  totalAmount: number;
  departmentName: string;
  employeeName: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface InvoiceStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}