-- Create storage buckets for customer documents and photos
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('customer-documents', 'customer-documents', false),
  ('customer-photos', 'customer-photos', true);

-- Create RLS policies for customer documents (private)
CREATE POLICY "Customers can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'customer-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Customers can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'customer-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Customers can update their own documents" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'customer-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Customers can delete their own documents" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'customer-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create RLS policies for customer photos (public viewing, private upload)
CREATE POLICY "Anyone can view customer photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'customer-photos');

CREATE POLICY "Customers can upload their own photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'customer-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Customers can update their own photos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'customer-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Customers can delete their own photos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'customer-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create a table to track job-related documents and photos
CREATE TABLE public.job_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'document' or 'photo'
  mime_type TEXT,
  file_size INTEGER,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on job_files
ALTER TABLE public.job_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for job_files
CREATE POLICY "Users can view job files in their organization" 
ON public.job_files 
FOR SELECT 
USING (
  job_id IN (
    SELECT jobs.id
    FROM jobs
    WHERE jobs.organization_id IN (
      SELECT users.organization_id
      FROM users
      WHERE users.auth_user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can manage job files in their organization" 
ON public.job_files 
FOR ALL 
USING (
  job_id IN (
    SELECT jobs.id
    FROM jobs
    WHERE jobs.organization_id IN (
      SELECT users.organization_id
      FROM users
      WHERE users.auth_user_id = auth.uid()
    )
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_job_files_updated_at
BEFORE UPDATE ON public.job_files
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();