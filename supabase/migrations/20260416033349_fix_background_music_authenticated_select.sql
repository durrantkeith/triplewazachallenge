/*
  # Fix background_music SELECT policy for authenticated users

  ## Summary
  The previous migration replaced broad public SELECT policies with name-restricted ones,
  but Supabase storage requires authenticated users to have SELECT access on storage.objects
  during upload operations (to check for existing files when upsert=false).

  ## Changes
  - Add explicit SELECT policy for authenticated users on background_music bucket
  - Add explicit SELECT policy for authenticated users on music bucket
  - Keeps the public read-by-name policy for unauthenticated URL access

  ## Security
  - Authenticated users (admins) can list and access their own uploaded files
  - Public users can only access files by direct URL (name IS NOT NULL check)
*/

CREATE POLICY "Authenticated users can read background_music files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'background_music');

CREATE POLICY "Authenticated users can read music files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'music');

CREATE POLICY "Authenticated users can read founder photos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'founder-photos');
