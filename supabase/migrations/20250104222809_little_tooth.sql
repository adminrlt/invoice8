-- First check if table exists and create if not
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'invoice_assignments') THEN
    -- Create invoice_assignments table
    CREATE TABLE invoice_assignments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      invoice_id uuid REFERENCES documents(id) ON DELETE CASCADE,
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

    -- Create indices
    CREATE INDEX IF NOT EXISTS idx_invoice_assignments_invoice ON invoice_assignments(invoice_id);
    CREATE INDEX IF NOT EXISTS idx_invoice_assignments_department ON invoice_assignments(department_id);
    CREATE INDEX IF NOT EXISTS idx_invoice_assignments_employee ON invoice_assignments(employee_id);
    CREATE INDEX IF NOT EXISTS idx_invoice_assignments_status ON invoice_assignments(status);
  ELSE
    -- Table exists, ensure indices are created
    CREATE INDEX IF NOT EXISTS idx_invoice_assignments_invoice ON invoice_assignments(invoice_id);
    CREATE INDEX IF NOT EXISTS idx_invoice_assignments_department ON invoice_assignments(department_id);
    CREATE INDEX IF NOT EXISTS idx_invoice_assignments_employee ON invoice_assignments(employee_id);
    CREATE INDEX IF NOT EXISTS idx_invoice_assignments_status ON invoice_assignments(status);
  END IF;
END $$;