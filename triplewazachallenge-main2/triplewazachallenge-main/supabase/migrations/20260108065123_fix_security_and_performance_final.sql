/*
  # Fix Security and Performance Issues

  ## Changes Made

  1. **Drop Unused Index**
     - Remove `idx_submissions_dojo_id` which is not being used by queries

  2. **Add Foreign Key Indexes for Performance**
     - Add index on `kata_sets.kata_id` to support foreign key constraint `kata_sets_kata_id_fkey`
     - Add index on `submissions.kata_set_id` to support foreign key constraint `submissions_kata_set_id_fkey`

  3. **Security Notes**
     - Foreign key indexes improve query performance and prevent table locks during updates/deletes
     - Removing unused indexes reduces maintenance overhead and improves write performance
     - Password breach protection must be enabled in Supabase Auth settings (cannot be done via SQL)
*/

-- Drop unused index that is not being utilized by queries
DROP INDEX IF EXISTS idx_submissions_dojo_id;

-- Add index for kata_sets.kata_id foreign key to improve join performance
CREATE INDEX IF NOT EXISTS idx_kata_sets_kata_id ON kata_sets(kata_id);

-- Add index for submissions.kata_set_id foreign key to improve join performance
CREATE INDEX IF NOT EXISTS idx_submissions_kata_set_id ON submissions(kata_set_id);
