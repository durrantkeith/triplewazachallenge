/*
  # Fix Testimonials RLS Policies
  
  1. Changes
    - Add public read policy for testimonials table
    - Allow anyone to view active testimonials
  
  2. Security
    - Enable RLS (already enabled)
    - Add SELECT policy for public access to active testimonials only
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'testimonials' 
    AND policyname = 'Anyone can view active testimonials'
  ) THEN
    CREATE POLICY "Anyone can view active testimonials"
      ON testimonials
      FOR SELECT
      USING (is_active = true);
  END IF;
END $$;