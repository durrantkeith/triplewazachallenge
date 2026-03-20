/*
  # Add Engagement Features

  1. New Tables
    - `newsletter_signups`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `dojo_name` (text, optional)
      - `subscribed_at` (timestamptz, default now())
      - `is_active` (boolean, default true)
    
    - `testimonials`
      - `id` (uuid, primary key)
      - `sensei_name` (text, not null)
      - `dojo_name` (text, not null)
      - `location` (text, not null)
      - `quote` (text, not null)
      - `is_active` (boolean, default true)
      - `display_order` (integer, default 0)
      - `created_at` (timestamptz, default now())

  2. Table Modifications
    - Add `total_submissions` to `dojos` table
    - Add `milestone_badges` JSONB array to track achievements

  3. Security
    - Enable RLS on all new tables
    - Newsletter signups: Public can insert, admins can read/update
    - Testimonials: Public can read active ones, admins can manage all
*/

-- Create newsletter signups table
CREATE TABLE IF NOT EXISTS newsletter_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  dojo_name text,
  subscribed_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admins can view all newsletter signups"
  ON newsletter_signups
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
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
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'ospenterprises@gmail.com'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'ospenterprises@gmail.com'
    )
  );

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sensei_name text NOT NULL,
  dojo_name text NOT NULL,
  location text NOT NULL,
  quote text NOT NULL,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active testimonials"
  ON testimonials
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can view all testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'ospenterprises@gmail.com'
    )
  );

CREATE POLICY "Admins can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
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
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'ospenterprises@gmail.com'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
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
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'ospenterprises@gmail.com'
    )
  );

-- Add milestone tracking to dojos table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dojos' AND column_name = 'total_submissions'
  ) THEN
    ALTER TABLE dojos ADD COLUMN total_submissions integer DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'dojos' AND column_name = 'milestone_badges'
  ) THEN
    ALTER TABLE dojos ADD COLUMN milestone_badges jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_signups(email);
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_dojos_total_submissions ON dojos(total_submissions DESC);