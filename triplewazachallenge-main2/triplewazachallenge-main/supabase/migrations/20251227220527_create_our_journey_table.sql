/*
  # Create Our Journey Content Table

  1. New Tables
    - `our_journey_content`
      - `id` (uuid, primary key)
      - `section_key` (text, unique) - Identifies the content section
      - `title` (text) - Section title
      - `content` (text) - Main content text
      - `order_index` (integer) - Display order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `our_journey_content` table
    - Add policy for public read access (anyone can view)
    - Add policy for authenticated admin write access

  3. Initial Data
    - Insert the default "Our Journey" content
*/

-- Create the our_journey_content table
CREATE TABLE IF NOT EXISTS our_journey_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE our_journey_content ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view our journey content"
  ON our_journey_content
  FOR SELECT
  TO public
  USING (true);

-- Admin write access (authenticated users can update)
CREATE POLICY "Authenticated users can update our journey content"
  ON our_journey_content
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert our journey content"
  ON our_journey_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete our journey content"
  ON our_journey_content
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default content
INSERT INTO our_journey_content (section_key, title, content, order_index)
VALUES (
  'main_story',
  'Our Journey',
  'The Triple Waza Friendship Challenge was born from decades of teaching and observing how judo is learned, tested—and too often, forgotten.

Over the years, a clear pattern emerged. Students would train hard to learn an entire kata, such as Nage no Kata, successfully pass their test, and then retain that knowledge for only a short time—sometimes less than a week. Once the examination was over, much of the understanding faded.

This experience revealed a deeper problem: traditional judo kata was quietly declining, and with it, a vast reservoir of technical, historical, and educational knowledge.

It became clear that the issue was not a lack of dedication or effort, but how kata was being taught and learned. There was a growing need for a better approach—one that emphasized understanding, repetition, shared experience, and long-term retention rather than short-term memorization.

The Triple Waza Friendship Challenge was created to address this need. By focusing on small, achievable goals, group participation, and global connection, the challenge helps safeguard traditional judo kata while making learning engaging, meaningful, and lasting—for all.

This is not about replacing tradition. It is about protecting it, sharing it, and ensuring it remains alive for future generations of judoka.',
  1
)
ON CONFLICT (section_key) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_our_journey_content_updated_at
  BEFORE UPDATE ON our_journey_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();