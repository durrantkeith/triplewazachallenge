/*
  # Remove Unused Indexes

  ## Changes Made
  
  1. **Remove Unused Indexes from submissions table**
     - Drop `idx_submissions_dojo_id` - not being used by query optimizer
     - Drop `idx_submissions_country` - not being used by query optimizer  
     - Drop `idx_submissions_email` - not being used by query optimizer
  
  ## Performance Impact
  
  - Removes unused database objects that cause write overhead
  - Each index requires maintenance on INSERT/UPDATE/DELETE operations
  - Eliminating unused indexes improves write performance
  - Reduces storage space
  
  ## Security Impact
  
  - Reduces attack surface by eliminating unnecessary database objects
  - Simplifies database schema maintenance
  
  ## Note on Password Breach Protection
  
  Password breach protection (HaveIBeenPwned integration) must be enabled through 
  the Supabase Dashboard under Authentication > Settings > Password Protection.
  This cannot be enabled via SQL migrations due to permission restrictions.
*/

-- Drop unused indexes on submissions table
DROP INDEX IF EXISTS idx_submissions_dojo_id;
DROP INDEX IF EXISTS idx_submissions_country;
DROP INDEX IF EXISTS idx_submissions_email;