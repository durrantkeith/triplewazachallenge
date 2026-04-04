/*
  # Fix Security Issues - Drop Unused Index

  ## Changes Made
  
  1. **Remove Unused Index**
     - Drops `idx_submissions_dojo_id` index on submissions table
     - This index has not been used and creates unnecessary maintenance overhead
     - Removing unused indexes improves database performance and reduces storage
  
  ## Security Impact
  
  - Removes unused database objects
  - Reduces attack surface by eliminating unnecessary database structures
  - Improves database maintenance and performance
  
  ## Note on Password Breach Protection
  
  The password breach protection (HaveIBeenPwned.org integration) cannot be enabled 
  via SQL migrations. This is a project-level setting that must be enabled through 
  the Supabase Dashboard:
  
  1. Go to Authentication > Settings
  2. Find the "Password Protection" section
  3. Enable "Check passwords against HaveIBeenPwned"
  
  This feature prevents users from using compromised passwords and enhances security.
*/

-- Drop unused index on submissions.dojo_id
DROP INDEX IF EXISTS idx_submissions_dojo_id;