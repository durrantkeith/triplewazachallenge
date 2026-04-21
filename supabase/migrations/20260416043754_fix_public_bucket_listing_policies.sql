/*
  # Fix Public Bucket Listing Policies

  Public buckets (background_music, founder-photos, music) do not need broad SELECT
  policies on storage.objects because public buckets allow direct URL access without
  any policy. The existing broad authenticated SELECT policies allow clients to LIST
  all files in the bucket, which may expose more data than intended.

  ## Changes
  - Drop broad SELECT policies on storage.objects for all three public buckets
  - Public bucket objects remain accessible via direct URL (no policy needed)
*/

DROP POLICY IF EXISTS "Authenticated users can read background_music files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read founder photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read music files" ON storage.objects;
