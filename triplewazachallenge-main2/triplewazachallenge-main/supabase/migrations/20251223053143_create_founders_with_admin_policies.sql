/*
  # Create Founders Table with Admin Policies
  
  1. New Tables
    - `founders`
      - `id` (uuid, primary key)
      - `name` (text) - Full name of the founder
      - `title` (text) - Title/rank (e.g., "Sensei", "5th Dan Black Belt")
      - `country` (text) - Country they represent
      - `city` (text) - City/location
      - `photo_url` (text) - URL to their profile photo
      - `bio` (text) - Their story and contribution
      - `contribution_type` (text) - Type of contribution (e.g., "Early Adopter", "International Ambassador", "Technical Advisor")
      - `order_index` (integer) - For custom ordering
      - `created_at` (timestamptz) - When added to the system
  
  2. Security
    - Enable RLS on `founders` table
    - Add policy for public read access (founders are public figures)
    - Add policies for authenticated users to insert, update, and delete founders
*/

-- Create founders table
CREATE TABLE IF NOT EXISTS founders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  photo_url text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  contribution_type text NOT NULL DEFAULT '',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;

-- Public read access - founders are public figures
CREATE POLICY "Anyone can view founders"
  ON founders
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users (admins) can insert founders
CREATE POLICY "Authenticated users can insert founders"
  ON founders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users (admins) can update founders
CREATE POLICY "Authenticated users can update founders"
  ON founders
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users (admins) can delete founders
CREATE POLICY "Authenticated users can delete founders"
  ON founders
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_founders_order 
ON founders(order_index);
