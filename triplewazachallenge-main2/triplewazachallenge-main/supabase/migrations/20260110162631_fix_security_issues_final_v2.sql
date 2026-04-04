/*
  # Fix Security and Performance Issues - Final

  ## Changes Made

  1. **Drop Unused Indexes**
     - Remove `idx_kata_sets_kata_id` - not being used by queries
     - Remove `idx_submissions_kata_set_id` - not being used by queries

  2. **Add Required Foreign Key Index**
     - Add index on `submissions.dojo_id` to support foreign key `submissions_dojo_id_fkey`
     - This prevents table locks and improves query performance

  3. **Security Notes**
     - Password breach protection should be enabled in Supabase Auth dashboard
     - Navigate to: Authentication → Settings → Enable "Password breach protection"
     - This feature checks passwords against HaveIBeenPwned.org database
*/

-- Drop unused indexes to improve write performance
DROP INDEX IF EXISTS idx_kata_sets_kata_id;
DROP INDEX IF EXISTS idx_submissions_kata_set_id;

-- Add index for submissions.dojo_id foreign key (submissions_dojo_id_fkey)
-- This is critical for performance and prevents table locks during CASCADE operations
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id_fk ON submissions(dojo_id);
