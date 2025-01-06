-- Drop existing index first (if exists)
DROP INDEX IF EXISTS idx_documents_case_number;

-- Create new index without CONCURRENTLY
CREATE UNIQUE INDEX idx_documents_case_number 
ON documents(case_number) 
WHERE case_number IS NOT NULL;

-- Update statistics
ANALYZE documents;