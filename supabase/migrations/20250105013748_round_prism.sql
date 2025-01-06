-- Drop existing objects
DROP TRIGGER IF EXISTS documents_case_number_trigger ON documents;
DROP FUNCTION IF EXISTS generate_case_number();
DROP FUNCTION IF EXISTS set_case_number();
DROP SEQUENCE IF EXISTS case_number_seq;

-- Create sequence with proper cache settings
CREATE SEQUENCE case_number_seq
  MINVALUE 1
  NO MAXVALUE
  CACHE 1;

-- Create function to generate case number with proper locking
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS text AS $$
DECLARE
  year text;
  sequence_val int;
  new_case_number text;
  max_attempts constant int := 100;
  current_attempt int := 0;
BEGIN
  -- Get exclusive lock
  PERFORM pg_advisory_xact_lock(hashtext('case_number_generation'));
  
  year := to_char(current_date, 'YYYY');
  
  LOOP
    EXIT WHEN current_attempt >= max_attempts;
    
    -- Get next sequence value atomically
    sequence_val := nextval('case_number_seq');
    new_case_number := 'CASE-' || year || '-' || lpad(sequence_val::text, 6, '0');
    
    -- Check if case number exists
    IF NOT EXISTS (
      SELECT 1 
      FROM documents 
      WHERE case_number = new_case_number
      FOR UPDATE SKIP LOCKED
    ) THEN
      RETURN new_case_number;
    END IF;
    
    current_attempt := current_attempt + 1;
  END LOOP;

  RAISE EXCEPTION 'Could not generate unique case number after % attempts', max_attempts;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function with error handling
CREATE OR REPLACE FUNCTION set_case_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set case number if not provided
  IF NEW.case_number IS NULL THEN
    BEGIN
      NEW.case_number := generate_case_number();
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to generate case number: %', SQLERRM;
      -- Return NULL to fail the insert rather than create invalid data
      RETURN NULL;
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER documents_case_number_trigger
  BEFORE INSERT ON documents
  FOR EACH ROW
  EXECUTE FUNCTION set_case_number();

-- Recreate index with proper locking hints
DROP INDEX IF EXISTS idx_documents_case_number;
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_documents_case_number 
ON documents(case_number) 
WHERE case_number IS NOT NULL;

-- Set proper permissions
GRANT USAGE ON SEQUENCE case_number_seq TO authenticated;