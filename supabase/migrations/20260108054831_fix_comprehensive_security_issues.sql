/*
  # Comprehensive Security and Performance Fix
  
  ## Changes
  
  1. **Performance Improvements**
     - Add missing foreign key indexes:
       - `kata_sets.kata_id` (for kata_sets_kata_id_fkey)
       - `submissions.kata_set_id` (for submissions_kata_set_id_fkey)
     - Drop unused indexes:
       - `idx_friend_referrals_recipient_email`
       - `idx_friend_referrals_sent_at`
       - `idx_submissions_dojo_id_fk`
  
  2. **Security Enhancements**
     - Create helper function to check admin status
     - Fix all RLS policies with `true` clauses:
       - **Public tables** (dojos, submissions, newsletter_signups, friend_referrals):
         - Keep INSERT open for anonymous users (intentional for public submissions)
         - Restrict UPDATE/DELETE to admin users only
       - **Admin-only tables** (founders, educational_videos, featured_dojos, our_journey_content):
         - Restrict all operations to admin users only
  
  3. **Important Notes**
     - Admin users are identified by the `is_admin` claim in auth.jwt()
     - To set a user as admin, update their raw_app_meta_data with `is_admin: true`
     - Password protection should be enabled in Supabase Auth settings manually
*/

-- Drop unused indexes first
DROP INDEX IF EXISTS idx_friend_referrals_recipient_email;
DROP INDEX IF EXISTS idx_friend_referrals_sent_at;
DROP INDEX IF EXISTS idx_submissions_dojo_id_fk;

-- Add missing foreign key indexes for performance
CREATE INDEX IF NOT EXISTS idx_kata_sets_kata_id ON kata_sets(kata_id);
CREATE INDEX IF NOT EXISTS idx_submissions_kata_set_id ON submissions(kata_set_id);

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean,
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix dojos RLS policies
DROP POLICY IF EXISTS "Anyone can create dojos" ON dojos;
DROP POLICY IF EXISTS "Authenticated users can update dojos" ON dojos;
DROP POLICY IF EXISTS "Authenticated users can delete dojos" ON dojos;

CREATE POLICY "Anyone can create dojos"
  ON dojos FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update dojos"
  ON dojos FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete dojos"
  ON dojos FOR DELETE
  TO authenticated
  USING (is_admin());

-- Fix submissions RLS policies
DROP POLICY IF EXISTS "Anyone can create submissions" ON submissions;
DROP POLICY IF EXISTS "Authenticated users can update submissions" ON submissions;
DROP POLICY IF EXISTS "Authenticated users can delete submissions" ON submissions;

CREATE POLICY "Anyone can create submissions"
  ON submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update submissions"
  ON submissions FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete submissions"
  ON submissions FOR DELETE
  TO authenticated
  USING (is_admin());

-- Fix newsletter_signups RLS policies
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_signups;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_signups FOR INSERT
  TO anon
  WITH CHECK (true);

-- Fix friend_referrals RLS policies
DROP POLICY IF EXISTS "Anyone can submit friend referrals" ON friend_referrals;

CREATE POLICY "Anyone can submit friend referrals"
  ON friend_referrals FOR INSERT
  TO anon
  WITH CHECK (true);

-- Fix educational_videos RLS policies (admin only)
DROP POLICY IF EXISTS "Authenticated users can insert educational videos" ON educational_videos;
DROP POLICY IF EXISTS "Authenticated users can update educational videos" ON educational_videos;
DROP POLICY IF EXISTS "Authenticated users can delete educational videos" ON educational_videos;

CREATE POLICY "Admins can insert educational videos"
  ON educational_videos FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update educational videos"
  ON educational_videos FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete educational videos"
  ON educational_videos FOR DELETE
  TO authenticated
  USING (is_admin());

-- Fix featured_dojos RLS policies (admin only)
DROP POLICY IF EXISTS "Authenticated users can insert featured dojos" ON featured_dojos;
DROP POLICY IF EXISTS "Authenticated users can update featured dojos" ON featured_dojos;
DROP POLICY IF EXISTS "Authenticated users can delete featured dojos" ON featured_dojos;

CREATE POLICY "Admins can insert featured dojos"
  ON featured_dojos FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update featured dojos"
  ON featured_dojos FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete featured dojos"
  ON featured_dojos FOR DELETE
  TO authenticated
  USING (is_admin());

-- Fix founders RLS policies (admin only)
DROP POLICY IF EXISTS "Authenticated users can insert founders" ON founders;
DROP POLICY IF EXISTS "Authenticated users can update founders" ON founders;
DROP POLICY IF EXISTS "Authenticated users can delete founders" ON founders;

CREATE POLICY "Admins can insert founders"
  ON founders FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update founders"
  ON founders FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete founders"
  ON founders FOR DELETE
  TO authenticated
  USING (is_admin());

-- Fix our_journey_content RLS policies (admin only)
DROP POLICY IF EXISTS "Authenticated users can insert our journey content" ON our_journey_content;
DROP POLICY IF EXISTS "Authenticated users can update our journey content" ON our_journey_content;
DROP POLICY IF EXISTS "Authenticated users can delete our journey content" ON our_journey_content;

CREATE POLICY "Admins can insert our journey content"
  ON our_journey_content FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update our journey content"
  ON our_journey_content FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete our journey content"
  ON our_journey_content FOR DELETE
  TO authenticated
  USING (is_admin());