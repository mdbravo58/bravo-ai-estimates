-- Make customer-photos bucket public so logos can be displayed
-- Public URLs only work when bucket.public = true
UPDATE storage.buckets 
SET public = true 
WHERE id = 'customer-photos';