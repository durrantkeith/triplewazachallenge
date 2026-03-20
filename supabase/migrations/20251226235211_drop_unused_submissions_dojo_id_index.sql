/*
  # Drop Unused Index on submissions.dojo_id
  
  1. Changes
    - Drop the unused index `idx_submissions_dojo_id` on the `submissions` table
    - This index has been flagged as unused by Supabase's security scanner
    - The index can be recreated later if query patterns show it's needed
  
  2. Performance Considerations
    - The index is currently unused and consuming storage
    - If future query patterns require it, we can recreate it based on actual usage data
*/

DROP INDEX IF EXISTS idx_submissions_dojo_id;