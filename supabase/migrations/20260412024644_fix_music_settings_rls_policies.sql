/*
  # Fix music_settings RLS policies

  1. Problem
    - UPDATE policy checks raw_user_meta_data for 'role = admin' but admin users
      are identified via raw_app_meta_data 'is_admin = true' everywhere else
    - No INSERT policy exists, blocking first-time row creation

  2. Changes
    - Drop the broken UPDATE policy
    - Add correct UPDATE policy using raw_app_meta_data is_admin check
    - Add INSERT policy for admins so initial row can be created
    - Add DELETE policy for admins
*/

DROP POLICY IF EXISTS "Admins can update music settings" ON music_settings;

CREATE POLICY "Admins can update music settings"
  ON music_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND ((users.raw_app_meta_data ->> 'is_admin')::boolean = true)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND ((users.raw_app_meta_data ->> 'is_admin')::boolean = true)
    )
  );

CREATE POLICY "Admins can insert music settings"
  ON music_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND ((users.raw_app_meta_data ->> 'is_admin')::boolean = true)
    )
  );

CREATE POLICY "Admins can delete music settings"
  ON music_settings
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE users.id = auth.uid()
      AND ((users.raw_app_meta_data ->> 'is_admin')::boolean = true)
    )
  );
