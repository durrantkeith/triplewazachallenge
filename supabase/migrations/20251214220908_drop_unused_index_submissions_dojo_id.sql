/*
  # Fix Security Issue: Remove Unused Index

  ## Changes Made
  
  1. **Remove Unused Index**
     - Drop `idx_submissions_dojo_id_fk` index on submissions table
     - This index has not been used and is consuming unnecessary resources
     - Foreign key constraint remains intact for data integrity

  ## Note
  The following security settings require Supabase Dashboard configuration:
  
  - **Leaked Password Protection**: Enable in Authentication > Settings
  - **Auth Connection Strategy**: Configure in Database Settings
  
  These settings cannot be modified through SQL migrations and must be 
  configured through the Supabase project dashboard.
*/

-- Drop unused index on submissions table
DROP INDEX IF EXISTS idx_submissions_dojo_id_fk;