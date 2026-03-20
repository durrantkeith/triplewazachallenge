/*
  # Add country and email fields to submissions

  1. Changes
    - Add `country` column to submissions table (required field)
    - Add `email` column to submissions table (required field)
    - These fields allow submissions without requiring full dojo registration
  
  2. Purpose
    - Simplifies submission process to only collect essential contact information
    - Enables mailing list for future challenge notifications
*/

-- Add country and email columns to submissions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'country'
  ) THEN
    ALTER TABLE submissions ADD COLUMN country text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'email'
  ) THEN
    ALTER TABLE submissions ADD COLUMN email text NOT NULL DEFAULT '';
  END IF;
END $$;