/*
  # Create Educational Videos Table

  1. New Tables
    - `educational_videos`
      - `id` (uuid, primary key) - Unique identifier for each educational video
      - `title` (text) - Title of the educational video
      - `description` (text) - Description of what the video teaches
      - `video_url` (text) - YouTube URL for the video
      - `category` (text) - Category: 'drill', 'uki-otoshi', 'seoi-nage', 'kata-guruma', or 'general'
      - `order_index` (integer) - For sorting videos within categories
      - `created_at` (timestamptz) - Timestamp of when the video was added

  2. Security
    - Enable RLS on `educational_videos` table
    - Add policy for public read access (anyone can view educational content)
    - Add policy for authenticated users to insert videos (admins use Supabase auth)
    - Add policy for authenticated users to delete videos (admins use Supabase auth)
*/

CREATE TABLE IF NOT EXISTS educational_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  video_url text NOT NULL,
  category text NOT NULL CHECK (category IN ('drill', 'uki-otoshi', 'seoi-nage', 'kata-guruma', 'general')),
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE educational_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view educational videos"
  ON educational_videos
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert educational videos"
  ON educational_videos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete educational videos"
  ON educational_videos
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS educational_videos_category_order_idx 
  ON educational_videos(category, order_index);
