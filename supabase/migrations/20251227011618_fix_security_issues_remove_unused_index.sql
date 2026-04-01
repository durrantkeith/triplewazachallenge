/*
  # Fix Security Issues
  
  1. Performance & Security
    - Drop unused index `idx_submissions_dojo_id` on submissions table
    - The index is not being used by queries and adds unnecessary overhead
    
  2. Important Note
    - Leaked Password Protection should be enabled in Supabase Dashboard
    - Navigate to: Authentication > Settings > Enable "Check for leaked passwords"
    - This feature checks passwords against HaveIBeenPwned.org database
    - This setting cannot be changed via SQL and must be configured in the dashboard
*/

-- Drop the unused index to improve write performance and reduce storage
DROP INDEX IF EXISTS idx_submissions_dojo_id;
