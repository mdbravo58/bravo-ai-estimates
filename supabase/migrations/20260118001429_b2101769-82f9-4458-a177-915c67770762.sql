-- Add storage policy for organization logo uploads
-- Allow authenticated users to upload files to their organization's folder
CREATE POLICY "Users can upload to their organization folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'customer-photos' AND
  (storage.foldername(name))[1] = (
    SELECT organization_id::text 
    FROM public.users 
    WHERE auth_user_id = auth.uid()
    LIMIT 1
  )
);

-- Allow authenticated users to update files in their organization's folder
CREATE POLICY "Users can update their organization files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'customer-photos' AND
  (storage.foldername(name))[1] = (
    SELECT organization_id::text 
    FROM public.users 
    WHERE auth_user_id = auth.uid()
    LIMIT 1
  )
);

-- Allow authenticated users to delete files in their organization's folder
CREATE POLICY "Users can delete their organization files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'customer-photos' AND
  (storage.foldername(name))[1] = (
    SELECT organization_id::text 
    FROM public.users 
    WHERE auth_user_id = auth.uid()
    LIMIT 1
  )
);

-- Allow public read access to customer-photos bucket for logos
CREATE POLICY "Anyone can view customer photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'customer-photos');