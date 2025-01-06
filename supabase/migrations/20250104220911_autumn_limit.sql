-- First ensure cases bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('cases', 'cases', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Drop all existing policies for cases bucket to avoid conflicts
DROP POLICY IF EXISTS "Allow admin access to cases" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated access to cases PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to cases PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin full access to cases" ON storage.objects;

-- Create comprehensive policy for admin access
CREATE POLICY "admin_cases_access"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'cases' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'cases' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Create policy for authenticated users to access PDFs
CREATE POLICY "authenticated_cases_pdf_access"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'cases' AND
  lower(storage.extension(name)) = 'pdf'
);

-- Create policy for public access to PDFs
CREATE POLICY "public_cases_pdf_access"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'cases' AND
  lower(storage.extension(name)) = 'pdf'
);

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO public;