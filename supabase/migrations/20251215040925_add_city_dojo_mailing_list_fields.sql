/*
  # Add City, Dojo Name, and Mailing List Fields

  1. Changes
    - Add `city` column (text, required) to submissions table
    - Add `dojo_name` column (text, required) to submissions table
    - Add `join_mailing_list` column (boolean, default false) to submissions table

  2. Notes
    - These fields support the enhanced submission form
    - City and Dojo Name help identify where submissions come from
    - Mailing list opt-in allows for future challenge communications
*/

-- Add new columns to submissions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'city'
  ) THEN
    ALTER TABLE submissions ADD COLUMN city text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'dojo_name'
  ) THEN
    ALTER TABLE submissions ADD COLUMN dojo_name text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'join_mailing_list'
  ) THEN
    ALTER TABLE submissions ADD COLUMN join_mailing_list boolean DEFAULT false;
  END IF;
END $$;