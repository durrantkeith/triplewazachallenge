/*
  # Fix Background Music Storage Upload Policies

  1. Changes
    - Add INSERT policy to allow authenticated users to upload music files
    - Add SELECT policy to allow public access to read music files
    - Add UPDATE policy to allow authenticated users to update music files
    - Add DELETE policy to allow authenticated users to delete music files

  2. Security
    - INSERT: Authenticated users can upload to background_music bucket
    - SELECT: Public access for reading (bucket is public)
    - UPDATE: Authenticated users can update files
    - DELETE: Authenticated users can delete files
*/

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow authenticated uploads to background_music" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to background_music" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to background_music" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes to background_music" ON storage.objects;

-- Allow authenticated users to upload music files
CREATE POLICY "Allow authenticated uploads to background_music"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'background_music');

-- Allow public access to read music files
CREATE POLICY "Allow public access to background_music"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'background_music');

-- Allow authenticated users to update music files
CREATE POLICY "Allow authenticated updates to background_music"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'background_music')
WITH CHECK (bucket_id = 'background_music');

-- Allow authenticated users to delete music files
CREATE POLICY "Allow authenticated deletes to background_music"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'background_music');
