-- Drop existing function and trigger first
DROP TRIGGER IF EXISTS documents_case_number_trigger ON documents;
DROP FUNCTION IF EXISTS generate_case_number();
DROP FUNCTION IF EXISTS set_case_number();

-- Create improved case number generation function
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS text AS $$
DECLARE
  year text;
  sequence int;
  new_case_number text;
  attempts int := 0;
  max_attempts int := 10;
BEGIN
  year := to_char(current_date, 'YYYY');
  
  WHILE attempts < max_attempts LOOP
    -- Get the latest sequence number for the current year
    SELECT COALESCE(MAX(NULLIF(regexp_replace(case_number, '^CASE-' || year || '-', ''), '')), '0')::int + 1
    INTO sequence
    FROM documents
    WHERE case_number LIKE 'CASE-' || year || '-%';
    
    -- Generate new case number
    new_case_number := 'CASE-' || year || '-' || lpad(sequence::text, 6, '0');
    
    -- Check if this case number is already used
    IF NOT EXISTS (
      SELECT 1 FROM documents 
      WHERE case_number = new_case_number
    ) THEN
      RETURN new_case_number;
    END IF;
    
    attempts := attempts + 1;
  END LOOP;
  
  -- If we reach here, we couldn't generate a unique number
  RAISE EXCEPTION 'Could not generate unique case number after % attempts', max_attempts;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function with retry logic
CREATE OR REPLACE FUNCTION set_case_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.case_number IS NULL THEN
    NEW.case_number := generate_case_number();
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Retry once on unique violation
    NEW.case_number := generate_case_number();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER documents_case_number_trigger
  BEFORE INSERT ON documents
  FOR EACH ROW
  EXECUTE FUNCTION set_case_number();

-- Ensure index exists
CREATE UNIQUE INDEX IF NOT EXISTS idx_documents_case_number 
ON documents(case_number) 
WHERE case_number IS NOT NULL;