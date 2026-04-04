/*
  # Add music file path column and create storage bucket

  1. Changes
    - Add `music_file_path` column to `music_settings` table
    - Create `background_music` storage bucket
    - Set up storage policies for MP3 uploads
  
  2. Security
    - Public read access for music files
    - Authenticated users can upload/delete music files
*/

-- Add music_file_path column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'music_settings' AND column_name = 'music_file_path'
  ) THEN
    ALTER TABLE music_settings ADD COLUMN music_file_path text;
  END IF;
END $$;

-- Create storage bucket for background music
INSERT INTO storage.buckets (id, name, public)
VALUES ('background_music', 'background_music', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist and recreate
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public can read music files" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload music files" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete music files" ON storage.objects;
END $$;

-- Allow public read access to music files
CREATE POLICY "Public can read music files"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'background_music');

-- Allow authenticated users to upload music files
CREATE POLICY "Authenticated users can upload music files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'background_music');

-- Allow authenticated users to delete music files
CREATE POLICY "Authenticated users can delete music files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'background_music');
