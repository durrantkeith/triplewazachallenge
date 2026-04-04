/*
  # Create Kata Library Structure

  1. New Tables
    - `katas`
      - `id` (uuid, primary key)
      - `name` (text) - e.g., "Nage no Kata"
      - `slug` (text, unique) - e.g., "nage-no-kata" for URLs
      - `description` (text) - Educational description of the kata
      - `order_index` (integer) - Display order
      - `created_at` (timestamp)
    
    - `kata_sets`
      - `id` (uuid, primary key)
      - `kata_id` (uuid, foreign key to katas)
      - `set_number` (integer) - e.g., 1, 2, 3
      - `name` (text) - e.g., "Set of 3"
      - `description` (text) - What this set focuses on
      - `techniques` (jsonb) - Array of technique names
      - `created_at` (timestamp)
    
    - `levels`
      - `id` (uuid, primary key)
      - `level_number` (integer, unique) - 1-5
      - `name` (text) - e.g., "Level 1", "Level 2"
      - `description` (text) - Explanation of this level
      - `requirements` (text) - What's needed for this level
      - `created_at` (timestamp)

  2. Modifications
    - Add `kata_id` column to submissions table
    - Add `kata_set_id` column to submissions table
    - Add `technique_tags` jsonb column to submissions for future filtering

  3. Security
    - Enable RLS on all new tables
    - Add public read-only policies
    - Admin-only write policies

  4. Initial Data
    - Insert Nage no Kata
    - Insert initial sets and levels
*/

-- Create katas table
CREATE TABLE IF NOT EXISTS katas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT ''::text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE katas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view katas"
  ON katas FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert katas"
  ON katas FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "Only admins can update katas"
  ON katas FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "Only admins can delete katas"
  ON katas FOR DELETE
  TO authenticated
  USING (false);

-- Create kata_sets table
CREATE TABLE IF NOT EXISTS kata_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kata_id uuid NOT NULL REFERENCES katas(id) ON DELETE CASCADE,
  set_number integer NOT NULL,
  name text NOT NULL,
  description text DEFAULT ''::text,
  techniques jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE kata_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view kata sets"
  ON kata_sets FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert kata sets"
  ON kata_sets FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "Only admins can update kata sets"
  ON kata_sets FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "Only admins can delete kata sets"
  ON kata_sets FOR DELETE
  TO authenticated
  USING (false);

-- Create levels table
CREATE TABLE IF NOT EXISTS levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_number integer UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT ''::text,
  requirements text DEFAULT ''::text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view levels"
  ON levels FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert levels"
  ON levels FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "Only admins can update levels"
  ON levels FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "Only admins can delete levels"
  ON levels FOR DELETE
  TO authenticated
  USING (false);

-- Add new columns to submissions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'kata_id'
  ) THEN
    ALTER TABLE submissions ADD COLUMN kata_id uuid REFERENCES katas(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'kata_set_id'
  ) THEN
    ALTER TABLE submissions ADD COLUMN kata_set_id uuid REFERENCES kata_sets(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'technique_tags'
  ) THEN
    ALTER TABLE submissions ADD COLUMN technique_tags jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Insert initial kata: Nage no Kata
INSERT INTO katas (name, slug, description, order_index)
VALUES (
  'Nage no Kata',
  'nage-no-kata',
  'The forms of throwing. Nage-no-kata consists of 15 techniques divided into three sets of five techniques each. This kata demonstrates the fundamental throwing techniques of judo and their principles.',
  1
)
ON CONFLICT (slug) DO NOTHING;

-- Insert kata sets for Nage no Kata
INSERT INTO kata_sets (kata_id, set_number, name, description, techniques)
SELECT 
  k.id,
  1,
  'Te-waza (Hand Techniques)',
  'The first set focuses on hand throwing techniques, demonstrating proper use of hand and arm movements in throwing.',
  '["Uki Otoshi", "Seoi Nage", "Kata Guruma"]'::jsonb
FROM katas k
WHERE k.slug = 'nage-no-kata'
ON CONFLICT DO NOTHING;

INSERT INTO kata_sets (kata_id, set_number, name, description, techniques)
SELECT 
  k.id,
  2,
  'Koshi-waza (Hip Techniques)',
  'The second set demonstrates hip throwing techniques, showing how to use hip rotation and positioning effectively.',
  '["Uki Goshi", "Harai Goshi", "Tsurikomi Goshi"]'::jsonb
FROM katas k
WHERE k.slug = 'nage-no-kata'
ON CONFLICT DO NOTHING;

INSERT INTO kata_sets (kata_id, set_number, name, description, techniques)
SELECT 
  k.id,
  3,
  'Ashi-waza (Foot and Leg Techniques)',
  'The third set focuses on foot and leg techniques, demonstrating sweeps, reaps, and leg-based throws.',
  '["Okuri Ashi Harai", "Sasae Tsurikomi Ashi", "Uchi Mata"]'::jsonb
FROM katas k
WHERE k.slug = 'nage-no-kata'
ON CONFLICT DO NOTHING;

INSERT INTO kata_sets (kata_id, set_number, name, description, techniques)
SELECT 
  k.id,
  4,
  'Ma-sutemi-waza (Back Sacrifice Techniques)',
  'The fourth set demonstrates back sacrifice techniques where tori falls backward to throw uke.',
  '["Tomoe Nage", "Ura Nage", "Sumi Gaeshi"]'::jsonb
FROM katas k
WHERE k.slug = 'nage-no-kata'
ON CONFLICT DO NOTHING;

INSERT INTO kata_sets (kata_id, set_number, name, description, techniques)
SELECT 
  k.id,
  5,
  'Yoko-sutemi-waza (Side Sacrifice Techniques)',
  'The fifth set demonstrates side sacrifice techniques where tori falls to the side to throw uke.',
  '["Yoko Gake", "Yoko Guruma", "Uki Waza"]'::jsonb
FROM katas k
WHERE k.slug = 'nage-no-kata'
ON CONFLICT DO NOTHING;

-- Insert levels 1-5
INSERT INTO levels (level_number, name, description, requirements)
VALUES 
  (1, 'Level 1', 'Introduction level - demonstrating basic understanding of the techniques', 'Perform the three techniques of the set with basic form and understanding'),
  (2, 'Level 2', 'Developing level - showing improved technique and coordination', 'Demonstrate smoother transitions and better technical execution'),
  (3, 'Level 3', 'Intermediate level - displaying solid technique and rhythm', 'Show consistent form, proper timing, and good partnering'),
  (4, 'Level 4', 'Advanced level - exhibiting refined technique and expression', 'Demonstrate refined technique, excellent rhythm, and kata spirit'),
  (5, 'Level 5', 'Mastery level - showing exceptional understanding and performance', 'Display mastery of form, perfect harmony with partner, and deep understanding of principles')
ON CONFLICT (level_number) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_kata_sets_kata_id ON kata_sets(kata_id);
CREATE INDEX IF NOT EXISTS idx_submissions_kata_id ON submissions(kata_id);
CREATE INDEX IF NOT EXISTS idx_submissions_kata_set_id ON submissions(kata_set_id);
