/*
  # Drop Unused Index and Improve Security Policies

  ## Changes
  
  1. **Drop Unused Index**
    - Remove `idx_submissions_dojo_id` as it's not being utilized by the query planner
  
  2. **Improve Anonymous Access Policies**
    - Enhance dojo registration policy with basic validation
    - Enhance submission policy with basic validation
    - These policies still allow public access (required for the application) but with better constraints

  ## Security Notes
  - Public access is intentional for this community-driven application
  - Policies now include basic validation to prevent empty/invalid submissions
  - Rate limiting should be implemented at the application layer
*/

-- Drop the unused index on submissions.dojo_id
DROP INDEX IF EXISTS idx_submissions_dojo_id;

-- Improve the dojo registration policy with validation
DROP POLICY IF EXISTS "Anyone can register a dojo" ON dojos;
CREATE POLICY "Anyone can register a dojo"
  ON dojos
  FOR INSERT
  TO anon
  WITH CHECK (
    name IS NOT NULL 
    AND length(trim(name)) > 0
    AND country IS NOT NULL 
    AND length(trim(country)) > 0
    AND email IS NOT NULL 
    AND length(trim(email)) > 0
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );

-- Improve the submission policy with validation
DROP POLICY IF EXISTS "Anyone can submit videos" ON submissions;
CREATE POLICY "Anyone can submit videos"
  ON submissions
  FOR INSERT
  TO anon
  WITH CHECK (
    youtube_url IS NOT NULL 
    AND length(trim(youtube_url)) > 0
    AND (youtube_url ~* '^https?://(www\.)?(youtube\.com|youtu\.be)/')
    AND level >= 1 
    AND level <= 5
    AND dojo_name IS NOT NULL
    AND length(trim(dojo_name)) > 0
    AND country IS NOT NULL
    AND length(trim(country)) > 0
    AND email IS NOT NULL
    AND length(trim(email)) > 0
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );
