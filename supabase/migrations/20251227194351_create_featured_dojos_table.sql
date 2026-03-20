/*
  # Create Featured Dojos Table

  1. New Tables
    - `featured_dojos`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the dojo
      - `country` (text) - Country where the dojo is located
      - `city` (text) - City where the dojo is located
      - `participants` (integer) - Number of participants
      - `image_url` (text) - URL to the dojo's image
      - `description` (text) - Description of the dojo
      - `video_url` (text, nullable) - Optional video URL
      - `order_index` (integer) - Display order
      - `is_active` (boolean) - Whether the dojo is currently featured
      - `created_at` (timestamptz) - When the record was created
      - `updated_at` (timestamptz) - When the record was last updated

  2. Security
    - Enable RLS on `featured_dojos` table
    - Add policy for public read access to active featured dojos
    - Add policy for authenticated admins to manage featured dojos
*/

CREATE TABLE IF NOT EXISTS featured_dojos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL,
  city text NOT NULL,
  participants integer DEFAULT 0,
  image_url text NOT NULL,
  description text NOT NULL,
  video_url text,
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE featured_dojos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active featured dojos"
  ON featured_dojos
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all featured dojos"
  ON featured_dojos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert featured dojos"
  ON featured_dojos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update featured dojos"
  ON featured_dojos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete featured dojos"
  ON featured_dojos
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_featured_dojos_order ON featured_dojos(order_index) WHERE is_active = true;