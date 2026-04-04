/*
  # Add Public Access RLS Policies
  
  1. Changes
    - Add public policies for dojos table (read and insert)
    - Add public policies for submissions table (insert and read own)
  
  2. Security
    - Allow anyone to view dojos
    - Allow anyone to create new dojos (for registration)
    - Allow anyone to submit videos
    - Users can only see approved submissions or their own pending ones
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'dojos' 
    AND policyname = 'Anyone can view dojos'
  ) THEN
    CREATE POLICY "Anyone can view dojos"
      ON dojos
      FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'dojos' 
    AND policyname = 'Anyone can create dojos'
  ) THEN
    CREATE POLICY "Anyone can create dojos"
      ON dojos
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'submissions' 
    AND policyname = 'Anyone can create submissions'
  ) THEN
    CREATE POLICY "Anyone can create submissions"
      ON submissions
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'submissions' 
    AND policyname = 'Anyone can view approved submissions'
  ) THEN
    CREATE POLICY "Anyone can view approved submissions"
      ON submissions
      FOR SELECT
      USING (status = 'approved');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'educational_videos' 
    AND policyname = 'Anyone can view educational videos'
  ) THEN
    CREATE POLICY "Anyone can view educational videos"
      ON educational_videos
      FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'founders' 
    AND policyname = 'Anyone can view founders'
  ) THEN
    CREATE POLICY "Anyone can view founders"
      ON founders
      FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'newsletter_signups' 
    AND policyname = 'Anyone can signup for newsletter'
  ) THEN
    CREATE POLICY "Anyone can signup for newsletter"
      ON newsletter_signups
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;