/*
  # Fix Security and Performance Issues

  1. Performance Optimizations
    - Add missing index on `submissions.dojo_id` foreign key for query optimization
    - Optimize RLS policies to use `(SELECT auth.uid())` instead of `auth.uid()` directly
      This prevents re-evaluation of auth functions for each row, improving performance at scale
    - Remove unused indexes: `idx_newsletter_email` and `idx_dojos_total_submissions`

  2. Security Improvements
    - Fix multiple permissive policies on `testimonials` table
      Consolidate SELECT policies to avoid redundant permission checks
    - Optimize all admin RLS policies for better performance

  3. Changes Applied
    - Drop and recreate RLS policies on `newsletter_signups` with optimized auth checks
    - Drop and recreate RLS policies on `testimonials` with optimized auth checks
    - Combine duplicate SELECT policies on `testimonials` into single policy
    - Add performance index on `submissions.dojo_id`
    - Remove unused indexes

  Note: Leaked password protection must be enabled in Supabase Dashboard settings
*/

-- Add missing index on submissions.dojo_id foreign key
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id_fk ON submissions(dojo_id);

-- Drop unused indexes
DROP INDEX IF EXISTS idx_newsletter_email;
DROP INDEX IF EXISTS idx_dojos_total_submissions;

-- Fix newsletter_signups RLS policies
-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all newsletter signups" ON newsletter_signups;
DROP POLICY IF EXISTS "Admins can update newsletter signups" ON newsletter_signups;

-- Recreate with optimized auth checks
CREATE POLICY "Admins can view all newsletter signups"
  ON newsletter_signups
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = (SELECT auth.uid())
      AND auth.users.email = 'ospenterprises@gmail.com'
    )
  );

CREATE POLICY "Admins can update newsletter signups"
  ON newsletter_signups
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = (SELECT auth.uid())
      AND auth.users.email = 'ospenterprises@gmail.com'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = (SELECT auth.uid())
      AND auth.users.email = 'ospenterprises@gmail.com'
    )
  );

-- Fix testimonials RLS policies
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can view all testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can delete testimonials" ON testimonials;

-- Create single consolidated SELECT policy (fixes multiple permissive policies issue)
CREATE POLICY "Public can view active, admins can view all testimonials"
  ON testimonials
  FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = (SELECT auth.uid())
      AND auth.users.email = 'ospenterprises@gmail.com'
    )
  );

-- Recreate admin management policies with optimized auth checks
CREATE POLICY "Admins can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = (SELECT auth.uid())
      AND auth.users.email = 'ospenterprises@gmail.com'
    )
  );

CREATE POLICY "Admins can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = (SELECT auth.uid())
      AND auth.users.email = 'ospenterprises@gmail.com'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = (SELECT auth.uid())
      AND auth.users.email = 'ospenterprises@gmail.com'
    )
  );

CREATE POLICY "Admins can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = (SELECT auth.uid())
      AND auth.users.email = 'ospenterprises@gmail.com'
    )
  );
