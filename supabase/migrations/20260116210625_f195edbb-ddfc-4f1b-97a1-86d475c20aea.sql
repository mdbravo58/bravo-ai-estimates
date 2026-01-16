-- Fix customer-photos bucket: make private and require authentication
UPDATE storage.buckets 
SET public = false 
WHERE id = 'customer-photos';

-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view customer photos" ON storage.objects;

-- Create authenticated-only viewing policy for customer photos
CREATE POLICY "Authenticated org members can view customer photos" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'customer-photos' 
  AND auth.uid() IS NOT NULL
  AND (
    -- User owns the file (uploaded it)
    auth.uid()::text = (storage.foldername(storage.objects.name))[1]
    OR 
    -- User is in the same organization as the job owner
    EXISTS (
      SELECT 1 FROM public.job_files jf
      JOIN public.jobs j ON j.id = jf.job_id
      JOIN public.users u ON u.organization_id = j.organization_id
      WHERE u.auth_user_id = auth.uid()
      AND jf.file_path = storage.objects.name
    )
    OR
    -- Fallback: user belongs to an organization (for general access)
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.auth_user_id = auth.uid()
      AND u.organization_id IS NOT NULL
    )
  )
);