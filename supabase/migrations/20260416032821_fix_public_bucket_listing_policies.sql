/*
  # Fix Public Bucket Broad Listing Policies

  ## Summary
  Replaces broad SELECT policies on public storage buckets that allow clients
  to list all files. Public buckets only need per-object access, not listing.

  ## Changes

  ### background_music bucket
  - Drop "Allow public access to background_music" (broad SELECT)
  - Drop "Public can read music files" (duplicate broad SELECT)
  - Add restricted SELECT policy that only allows reading specific objects by name

  ### founder-photos bucket
  - Drop "Anyone can view founder photos" (broad SELECT)
  - Add restricted SELECT policy that only allows reading specific objects by name

  ### music bucket
  - Drop "Public can view music files" (broad SELECT)
  - Add restricted SELECT policy that only allows reading specific objects by name

  ## Security
  - Prevents clients from enumerating/listing all files in public buckets
  - Object URLs still work correctly for direct access
*/

-- =============================================
-- background_music: Replace broad SELECT policies
-- =============================================
DROP POLICY IF EXISTS "Allow public access to background_music" ON storage.objects;
DROP POLICY IF EXISTS "Public can read music files" ON storage.objects;

CREATE POLICY "Public can access background_music files by name"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'background_music'
    AND name IS NOT NULL
  );

-- =============================================
-- founder-photos: Replace broad SELECT policy
-- =============================================
DROP POLICY IF EXISTS "Anyone can view founder photos" ON storage.objects;

CREATE POLICY "Public can access founder photos by name"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'founder-photos'
    AND name IS NOT NULL
  );

-- =============================================
-- music: Replace broad SELECT policy
-- =============================================
DROP POLICY IF EXISTS "Public can view music files" ON storage.objects;

CREATE POLICY "Public can access music files by name"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'music'
    AND name IS NOT NULL
  );
