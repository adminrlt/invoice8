-- Add document_info_id column to invoice_assignments
ALTER TABLE invoice_assignments
ADD COLUMN IF NOT EXISTS document_info_id uuid REFERENCES document_info(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_invoice_assignments_doc_info
ON invoice_assignments(document_info_id);