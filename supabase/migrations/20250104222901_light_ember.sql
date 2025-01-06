-- Drop existing indices first
DROP INDEX IF EXISTS idx_invoice_assignments_invoice;
DROP INDEX IF EXISTS idx_invoice_assignments_department;
DROP INDEX IF EXISTS idx_invoice_assignments_employee;
DROP INDEX IF EXISTS idx_invoice_assignments_status;

-- Drop existing table
DROP TABLE IF EXISTS invoice_assignments;

-- Create invoice_assignments table with correct column name
CREATE TABLE invoice_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id),
  employee_id uuid REFERENCES employees(id),
  status text DEFAULT 'pending',
  comments text[],
  assigned_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE invoice_assignments ENABLE ROW LEVEL SECURITY;

-- Create admin policy
CREATE POLICY "Allow admin access to invoice_assignments"
ON invoice_assignments
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Create indices with correct column name
CREATE INDEX idx_invoice_assignments_document ON invoice_assignments(document_id);
CREATE INDEX idx_invoice_assignments_department ON invoice_assignments(department_id);
CREATE INDEX idx_invoice_assignments_employee ON invoice_assignments(employee_id);
CREATE INDEX idx_invoice_assignments_status ON invoice_assignments(status);