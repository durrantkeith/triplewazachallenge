/*
  # Fix Security and Performance Issues
  
  ## Changes
  
  1. **Performance Improvements**
     - Add missing foreign key index for `submissions.dojo_id`
     - Drop unused indexes:
       - `idx_kata_sets_kata_id` (not being used by queries)
       - `idx_submissions_kata_set_id` (not being used by queries)
  
  2. **Function Security**
     - Fix `is_admin` function to have a stable search path by adding `SET search_path = public, pg_temp`
  
  3. **RLS Policy Improvements**
     - Add validation to public submission policies to ensure data quality:
       - **dojos**: Verify required fields (name, city, province_state, country, instructor_name, email)
       - **submissions**: Verify required fields (country, email format, youtube_url, level)
       - **newsletter_signups**: Verify email format
       - **friend_referrals**: Verify email formats and required fields
     - These tables still allow public submissions but with basic validation
  
  4. **Important Notes**
     - Password protection should be enabled in Supabase Auth dashboard settings
     - Public submission tables remain accessible to anonymous users (by design)
     - Validation ensures data integrity while maintaining accessibility
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_kata_sets_kata_id;
DROP INDEX IF EXISTS idx_submissions_kata_set_id;

-- Add index for submissions.dojo_id foreign key
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id ON submissions(dojo_id);

-- Fix is_admin function to have stable search path
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean,
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- Fix dojos INSERT policy with validation
DROP POLICY IF EXISTS "Anyone can create dojos" ON dojos;

CREATE POLICY "Anyone can create dojos"
  ON dojos FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND 
    length(trim(name)) > 0 AND
    city IS NOT NULL AND 
    length(trim(city)) > 0 AND
    province_state IS NOT NULL AND 
    length(trim(province_state)) > 0 AND
    country IS NOT NULL AND 
    length(trim(country)) > 0 AND
    instructor_name IS NOT NULL AND 
    length(trim(instructor_name)) > 0 AND
    email IS NOT NULL AND 
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );

-- Fix submissions INSERT policy with validation
DROP POLICY IF EXISTS "Anyone can create submissions" ON submissions;

CREATE POLICY "Anyone can create submissions"
  ON submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    country IS NOT NULL AND 
    length(trim(country)) > 0 AND
    email IS NOT NULL AND 
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
    youtube_url IS NOT NULL AND
    length(trim(youtube_url)) > 0 AND
    level IS NOT NULL AND
    level > 0 AND
    status IS NOT NULL AND
    length(trim(status)) > 0
  );

-- Fix newsletter_signups INSERT policy with validation
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_signups;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_signups FOR INSERT
  TO anon
  WITH CHECK (
    email IS NOT NULL AND 
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );

-- Fix friend_referrals INSERT policy with validation
DROP POLICY IF EXISTS "Anyone can submit friend referrals" ON friend_referrals;

CREATE POLICY "Anyone can submit friend referrals"
  ON friend_referrals FOR INSERT
  TO anon
  WITH CHECK (
    sender_name IS NOT NULL AND 
    length(trim(sender_name)) > 0 AND
    recipient_email IS NOT NULL AND 
    recipient_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
    (sender_email IS NULL OR (
      sender_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
      sender_email != recipient_email
    ))
  );