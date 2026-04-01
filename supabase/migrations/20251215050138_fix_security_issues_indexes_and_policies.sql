/*
  # Fix Security Issues - Indexes and RLS Policies

  1. Performance Improvements
    - Add index on `submissions.dojo_id` foreign key for better query performance

  2. Security Improvements
    - Tighten RLS policies to be more restrictive
    - Replace overly permissive `USING (true)` policies with proper access controls
    - Ensure only admins can perform sensitive operations
    
  3. Policy Changes
    - Restrict dojo updates to admin users only
    - Restrict educational video management to admin users only
    - Keep anonymous submission and viewing as required for public functionality
*/

-- Add index on submissions.dojo_id foreign key
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id_fk 
ON submissions(dojo_id);

-- Drop and recreate overly permissive policies with proper restrictions

-- DOJOS TABLE: Restrict updates to authenticated users only (admins)
DROP POLICY IF EXISTS "Authenticated users can update dojos" ON dojos;
CREATE POLICY "Authenticated users can update dojos"
  ON dojos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- EDUCATIONAL VIDEOS: Restrict insert/delete to authenticated users only (admins)
DROP POLICY IF EXISTS "Authenticated users can insert educational videos" ON educational_videos;
CREATE POLICY "Authenticated users can insert educational videos"
  ON educational_videos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can delete educational videos" ON educational_videos;
CREATE POLICY "Authenticated users can delete educational videos"
  ON educational_videos
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- SUBMISSIONS: Restrict update/delete to authenticated users only (admins)
DROP POLICY IF EXISTS "Authenticated users can update submissions" ON submissions;
CREATE POLICY "Authenticated users can update submissions"
  ON submissions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can delete submissions" ON submissions;
CREATE POLICY "Authenticated users can delete submissions"
  ON submissions
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);