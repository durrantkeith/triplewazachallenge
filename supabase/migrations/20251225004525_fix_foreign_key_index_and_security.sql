/*
  # Fix Security Issues - Foreign Key Index and Password Protection
  
  1. Database Changes
    - Add index `idx_submissions_dojo_id` on `submissions(dojo_id)` column
    - This index covers the foreign key constraint `submissions_dojo_id_fkey`
    - Improves query performance for joins and cascading operations
    
  2. Performance Impact
    - Faster JOIN operations between submissions and dojos tables
    - Prevents table locks during parent table (dojos) modifications
    - Optimizes queries filtering by dojo_id
    - Improves performance of DELETE/UPDATE operations on dojos table
    
  3. Security Notes
    - Addresses unindexed foreign key security warning
    - Note: Leaked Password Protection must be enabled in Supabase Dashboard
      Go to: Authentication > Providers > Email > Advanced Settings
      Enable "Check for compromised passwords with HaveIBeenPwned.org"
*/

-- Add index for foreign key on submissions.dojo_id
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id 
  ON submissions(dojo_id);