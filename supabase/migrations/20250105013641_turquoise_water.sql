-- Drop existing function and trigger
DROP TRIGGER IF EXISTS documents_case_number_trigger ON documents;
DROP FUNCTION IF EXISTS generate_case_number();
DROP FUNCTION IF EXISTS set_case_number();

-- Create sequence for case numbers
CREATE SEQUENCE IF NOT EXISTS case_number_seq;

-- Create improved case number generation function with proper locking
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS text AS $$
DECLARE
  year text;
  sequence_val int;
  new_case_number text;
BEGIN
  -- Lock the sequence to prevent concurrent access
  PERFORM pg_advisory_xact_lock(hashtext('case_number_generation'));
  
  year := to_char(current_date, 'YYYY');
  
  -- Get next sequence value atomically
  SELECT nextval('case_number_seq') INTO sequence_val;
  
  -- Generate new case number
  new_case_number := 'CASE-' || year || '-' || lpad(sequence_val::text, 6, '0');
  
  -- Verify uniqueness
  WHILE EXISTS (
    SELECT 1 FROM documents 
    WHERE case_number = new_case_number
  ) LOOP
    sequence_val := nextval('case_number_seq');
    new_case_number := 'CASE-' || year || '-' || lpad(sequence_val::text, 6, '0');
  END LOOP;
  
  RETURN new_case_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function with transaction-level locking
CREATE OR REPLACE FUNCTION set_case_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.case_number IS NULL THEN
    NEW.case_number := generate_case_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER documents_case_number_trigger
  BEFORE INSERT ON documents
  FOR EACH ROW
  EXECUTE FUNCTION set_case_number();

-- Recreate unique index
DROP INDEX IF EXISTS idx_documents_case_number;
CREATE UNIQUE INDEX idx_documents_case_number 
ON documents(case_number) 
WHERE case_number IS NOT NULL;