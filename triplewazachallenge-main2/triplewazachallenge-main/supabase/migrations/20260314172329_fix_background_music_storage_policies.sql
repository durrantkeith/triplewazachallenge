/*
  # Fix background music storage policies

  1. Changes
    - Drop overly restrictive storage policies
    - Create simpler policies that allow authenticated users to upload anywhere in the bucket
    - Keep public read access for playback
  
  2. Security
    - Public can read all music files
    - Authenticated users can upload, update, and delete music files
*/

-- Drop existing policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public can read music files" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload music files" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete music files" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update music files" ON storage.objects;
END $$;

-- Allow public read access to all music files
CREATE POLICY "Public can read music files"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'background_music');

-- Allow authenticated users to upload music files anywhere in the bucket
CREATE POLICY "Authenticated users can upload music files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'background_music');

-- Allow authenticated users to update music files
CREATE POLICY "Authenticated users can update music files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'background_music')
  WITH CHECK (bucket_id = 'background_music');

-- Allow authenticated users to delete music files
CREATE POLICY "Authenticated users can delete music files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'background_music');
