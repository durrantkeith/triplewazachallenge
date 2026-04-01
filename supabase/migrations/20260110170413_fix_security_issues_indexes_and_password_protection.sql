/*
  # Fix Security and Performance Issues

  1. Indexes
    - Add index for `submissions.dojo_id` foreign key to improve query performance
    - Drop unused index `idx_kata_sets_kata_id` on `kata_sets` table
    - Drop unused index `idx_submissions_kata_set_id` on `submissions` table

  2. Security Enhancements
    - Document requirement to enable Leaked Password Protection in Supabase Auth settings

  ## Important Notes

  ### Leaked Password Protection
  This migration documents the need to enable password protection against compromised passwords.
  
  **Action Required:**
  Enable "Leaked Password Protection" in Supabase Dashboard:
  1. Go to Authentication > Settings in Supabase Dashboard
  2. Enable "Leaked Password Protection" feature
  3. This checks passwords against HaveIBeenPwned.org database
  
  This feature cannot be enabled via SQL migration and must be configured through the dashboard.

  ### Index Optimization
  - Adding index on foreign key improves JOIN performance
  - Removing unused indexes reduces write overhead and storage
*/

-- Drop unused indexes first
DROP INDEX IF EXISTS idx_kata_sets_kata_id;
DROP INDEX IF EXISTS idx_submissions_kata_set_id;

-- Add index for submissions.dojo_id foreign key to improve query performance
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id_fk 
ON submissions(dojo_id);
