/*
  # Fix Auth RLS Initialization Plan and Multiple Permissive Policies

  ## Summary
  Fixes RLS policies that re-evaluate auth functions per-row (performance issue)
  and resolves the multiple permissive SELECT policies on testimonials.

  ## Changes

  ### educational_pages
  - Drop and recreate INSERT, UPDATE, DELETE admin policies
  - Replace auth.uid() with (select auth.uid()) for single evaluation

  ### educational_content_sections
  - Drop and recreate INSERT, UPDATE, DELETE admin policies
  - Replace auth.uid() with (select auth.uid()) for single evaluation

  ### testimonials
  - Drop and recreate all admin policies using (select auth.jwt())
  - Merge "Admins can view all testimonials" into "Anyone can view active testimonials"
    to eliminate multiple permissive SELECT policies for authenticated role
  - Admin SELECT will be handled by the public policy (admins can see active too)
    OR we consolidate so there is only one SELECT policy

  ### music_settings
  - Drop and recreate INSERT, UPDATE, DELETE admin policies
  - Replace auth.uid() with (select auth.uid()) for single evaluation

  ## Security
  - No functional change to access control, only query plan optimization
*/

-- =============================================
-- educational_pages: Fix admin policies
-- =============================================
DROP POLICY IF EXISTS "Admins can insert educational pages" ON public.educational_pages;
DROP POLICY IF EXISTS "Admins can update educational pages" ON public.educational_pages;
DROP POLICY IF EXISTS "Admins can delete educational pages" ON public.educational_pages;

CREATE POLICY "Admins can insert educational pages"
  ON public.educational_pages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = (select auth.uid())
        AND (users.raw_app_meta_data ->> 'role') = 'admin'
    )
  );

CREATE POLICY "Admins can update educational pages"
  ON public.educational_pages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = (select auth.uid())
        AND (users.raw_app_meta_data ->> 'role') = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = (select auth.uid())
        AND (users.raw_app_meta_data ->> 'role') = 'admin'
    )
  );

CREATE POLICY "Admins can delete educational pages"
  ON public.educational_pages
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = (select auth.uid())
        AND (users.raw_app_meta_data ->> 'role') = 'admin'
    )
  );

-- =============================================
-- educational_content_sections: Fix admin policies
-- =============================================
DROP POLICY IF EXISTS "Admins can insert educational content sections" ON public.educational_content_sections;
DROP POLICY IF EXISTS "Admins can update educational content sections" ON public.educational_content_sections;
DROP POLICY IF EXISTS "Admins can delete educational content sections" ON public.educational_content_sections;

CREATE POLICY "Admins can insert educational content sections"
  ON public.educational_content_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = (select auth.uid())
        AND (users.raw_app_meta_data ->> 'role') = 'admin'
    )
  );

CREATE POLICY "Admins can update educational content sections"
  ON public.educational_content_sections
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = (select auth.uid())
        AND (users.raw_app_meta_data ->> 'role') = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = (select auth.uid())
        AND (users.raw_app_meta_data ->> 'role') = 'admin'
    )
  );

CREATE POLICY "Admins can delete educational content sections"
  ON public.educational_content_sections
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = (select auth.uid())
        AND (users.raw_app_meta_data ->> 'role') = 'admin'
    )
  );

-- =============================================
-- testimonials: Fix auth.jwt() policies + merge duplicate SELECT
-- =============================================
DROP POLICY IF EXISTS "Admins can view all testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can view active testimonials" ON public.testimonials;

-- Single SELECT policy: active testimonials are public; admins see all
CREATE POLICY "Anyone can view active testimonials"
  ON public.testimonials
  FOR SELECT
  USING (
    is_active = true
    OR (select auth.jwt()) ->> 'email' = 'ospenterprises@gmail.com'
  );

CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (select auth.jwt()) ->> 'email' = 'ospenterprises@gmail.com'
  );

CREATE POLICY "Admins can update testimonials"
  ON public.testimonials
  FOR UPDATE
  TO authenticated
  USING (
    (select auth.jwt()) ->> 'email' = 'ospenterprises@gmail.com'
  )
  WITH CHECK (
    (select auth.jwt()) ->> 'email' = 'ospenterprises@gmail.com'
  );

CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials
  FOR DELETE
  TO authenticated
  USING (
    (select auth.jwt()) ->> 'email' = 'ospenterprises@gmail.com'
  );

-- =============================================
-- music_settings: Fix admin policies
-- =============================================
DROP POLICY IF EXISTS "Admins can insert music settings" ON public.music_settings;
DROP POLICY IF EXISTS "Admins can update music settings" ON public.music_settings;
DROP POLICY IF EXISTS "Admins can delete music settings" ON public.music_settings;

CREATE POLICY "Admins can insert music settings"
  ON public.music_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = (select auth.uid())
        AND ((users.raw_app_meta_data ->> 'is_admin')::boolean = true)
    )
  );

CREATE POLICY "Admins can update music settings"
  ON public.music_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = (select auth.uid())
        AND ((users.raw_app_meta_data ->> 'is_admin')::boolean = true)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = (select auth.uid())
        AND ((users.raw_app_meta_data ->> 'is_admin')::boolean = true)
    )
  );

CREATE POLICY "Admins can delete music settings"
  ON public.music_settings
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = (select auth.uid())
        AND ((users.raw_app_meta_data ->> 'is_admin')::boolean = true)
    )
  );
