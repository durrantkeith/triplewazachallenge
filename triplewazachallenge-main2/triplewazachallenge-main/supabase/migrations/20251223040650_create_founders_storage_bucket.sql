/*
  # Create Storage Bucket for Founder Photos
  
  1. Storage
    - Create `founder-photos` bucket for storing founder profile images
    - Enable public access for viewing photos
    - Restrict uploads to authenticated users only
  
  2. Security
    - Anyone can view photos (public bucket)
    - Only authenticated users can upload photos
    - Only authenticated users can update/delete photos
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('founder-photos', 'founder-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view founder photos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'founder-photos');

CREATE POLICY "Authenticated users can upload founder photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'founder-photos');

CREATE POLICY "Authenticated users can update founder photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'founder-photos')
  WITH CHECK (bucket_id = 'founder-photos');

CREATE POLICY "Authenticated users can delete founder photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'founder-photos');