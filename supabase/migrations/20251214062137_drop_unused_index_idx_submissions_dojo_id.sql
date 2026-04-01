/*
  # Drop Unused Index

  1. Index Cleanup
    - Drop unused index `idx_submissions_dojo_id` on `submissions` table
    - This index is not being used by any queries and can be safely removed
  
  ## Security Notes
  
  The following Auth configuration changes need to be made through the Supabase Dashboard:
  - Enable leaked password protection (HaveIBeenPwned integration)
  - Switch Auth connection strategy from fixed count to percentage-based allocation
  
  These settings cannot be modified via SQL migrations and require dashboard access.
*/

-- Drop unused index
DROP INDEX IF EXISTS idx_submissions_dojo_id;