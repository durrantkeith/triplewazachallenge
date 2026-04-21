/*
  # Fix Submissions RLS and Remaining Permissive Policies

  ## Summary
  Fixes two security issues:
  1. The "Anyone can view approved submissions" SELECT policy incorrectly allowed
     ANY authenticated user to bypass the approved-only filter and see all submissions
     (pending, rejected, approved). Only admins should see non-approved submissions.
  2. Ensures the featured_dojos SELECT policy is restricted properly (active only for public).

  ## Changes

  ### submissions
  - Drop and recreate SELECT policy so unauthenticated users and regular authenticated
    users can only see approved submissions. Admins can see all.

  ### featured_dojos
  - Drop permissive USING (true) SELECT policy
  - Recreate so only active dojos are visible publicly; admins see all

  ## Security
  - Non-admin authenticated users can no longer see pending/rejected submissions
  - Admin check uses the existing is_admin() function which reads app_metadata.is_admin
*/

-- =============================================
-- submissions: Fix SELECT policy
-- =============================================
DROP POLICY IF EXISTS "Anyone can view approved submissions" ON public.submissions;

CREATE POLICY "Public can view approved submissions only"
  ON public.submissions
  FOR SELECT
  USING (
    status = 'approved'
    OR is_admin()
  );

-- =============================================
-- featured_dojos: Fix SELECT policy (was USING (true))
-- =============================================
DROP POLICY IF EXISTS "Authenticated users can view all featured dojos" ON public.featured_dojos;
DROP POLICY IF EXISTS "Anyone can view active featured dojos" ON public.featured_dojos;

CREATE POLICY "Anyone can view active featured dojos"
  ON public.featured_dojos
  FOR SELECT
  USING (
    is_active = true
    OR is_admin()
  );
