-- Enable public access for cases bucket
UPDATE storage.buckets 
SET public = true 
WHERE id = 'cases';

-- Drop existing policies for cases bucket
DROP POLICY IF EXISTS "Allow admin access to cases" ON storage.objects;

-- Create policy for authenticated users to access PDFs in cases bucket
CREATE POLICY "Allow authenticated access to cases PDFs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'cases' AND
  lower(storage.extension(name)) = 'pdf'
);

-- Create policy for public access to PDFs in cases bucket
CREATE POLICY "Allow public access to cases PDFs"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'cases' AND
  lower(storage.extension(name)) = 'pdf'
);

-- Create policy for admin full access to cases bucket
CREATE POLICY "Allow admin full access to cases"
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