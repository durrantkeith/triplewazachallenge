/*
  # Fix Testimonials Public Access

  1. Changes
    - Drop existing restrictive policies on testimonials table
    - Add simple public read policy for active testimonials
    - Add admin-only policies that don't require joining auth.users table
  
  2. Security
    - Public users can view active testimonials only
    - Only admin email can insert, update, or delete testimonials
    - Uses direct auth.jwt() check instead of querying auth.users table
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view active, admins can view all testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can delete testimonials" ON testimonials;

-- Create new simplified policies
CREATE POLICY "Anyone can view active testimonials"
  ON testimonials FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can view all testimonials"
  ON testimonials FOR SELECT
  TO authenticated
  USING (
    (auth.jwt()->>'email')::text = 'ospenterprises@gmail.com'
  );

CREATE POLICY "Admins can insert testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt()->>'email')::text = 'ospenterprises@gmail.com'
  );

CREATE POLICY "Admins can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt()->>'email')::text = 'ospenterprises@gmail.com'
  )
  WITH CHECK (
    (auth.jwt()->>'email')::text = 'ospenterprises@gmail.com'
  );

CREATE POLICY "Admins can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (
    (auth.jwt()->>'email')::text = 'ospenterprises@gmail.com'
  );
