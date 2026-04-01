/*
  # Initial Database Schema

  1. New Tables
    - `dojos`
      - `id` (uuid, primary key)
      - `name` (text) - Dojo name
      - `city` (text) - City location
      - `province_state` (text) - Province or state
      - `country` (text) - Country
      - `instructor_name` (text) - Name of instructor
      - `email` (text) - Contact email
      - `mailing_list` (boolean) - Opt-in for updates
      - `created_at` (timestamptz)

    - `submissions`
      - `id` (uuid, primary key)
      - `dojo_id` (uuid, nullable foreign key to dojos)
      - `country` (text) - Country
      - `email` (text) - Submission email
      - `youtube_url` (text) - Video URL
      - `level` (integer) - Belt level
      - `participant_names` (text, nullable) - Names of participants
      - `message` (text, nullable) - Optional message
      - `status` (text) - pending, approved, or rejected
      - `submitted_at` (timestamptz)
      - `approved_at` (timestamptz, nullable)
      - `admin_notes` (text, nullable)

    - `educational_videos`
      - `id` (uuid, primary key)
      - `title` (text) - Video title
      - `description` (text) - Video description
      - `youtube_url` (text) - Video URL
      - `level` (integer) - Belt level
      - `order_index` (integer) - Display order
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for approved submissions and educational videos
    - Authenticated users can manage all data
    - Public users can create submissions and dojos
*/

-- Create dojos table
CREATE TABLE IF NOT EXISTS dojos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL DEFAULT '',
  province_state text NOT NULL DEFAULT '',
  country text NOT NULL,
  instructor_name text NOT NULL,
  email text NOT NULL,
  mailing_list boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dojo_id uuid REFERENCES dojos(id) ON DELETE SET NULL,
  country text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  youtube_url text NOT NULL,
  level integer NOT NULL,
  participant_names text,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at timestamptz DEFAULT now(),
  approved_at timestamptz,
  admin_notes text
);

-- Create educational_videos table
CREATE TABLE IF NOT EXISTS educational_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  youtube_url text NOT NULL,
  level integer NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE dojos ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_videos ENABLE ROW LEVEL SECURITY;

-- Dojos policies
CREATE POLICY "Anyone can view dojos"
  ON dojos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create dojos"
  ON dojos FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update dojos"
  ON dojos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete dojos"
  ON dojos FOR DELETE
  TO authenticated
  USING (true);

-- Submissions policies
CREATE POLICY "Anyone can view approved submissions"
  ON submissions FOR SELECT
  TO anon, authenticated
  USING (status = 'approved' OR auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can create submissions"
  ON submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update submissions"
  ON submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete submissions"
  ON submissions FOR DELETE
  TO authenticated
  USING (true);

-- Educational videos policies
CREATE POLICY "Anyone can view educational videos"
  ON educational_videos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert educational videos"
  ON educational_videos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update educational videos"
  ON educational_videos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete educational videos"
  ON educational_videos FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_educational_videos_level_order ON educational_videos(level, order_index);
