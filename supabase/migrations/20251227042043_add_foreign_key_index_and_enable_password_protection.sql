/*
  # Fix Security Issues
  
  1. Performance Improvements
    - Add index on `submissions.dojo_id` foreign key column
    - This improves JOIN performance between submissions and dojos tables
  
  2. Security Enhancements
    - Foreign key index prevents performance degradation on cascading operations
    - Ensures efficient query execution for referential integrity checks
  
  Note: Leaked password protection must be enabled in Supabase Auth dashboard settings.
  Navigate to: Authentication > Policies > Enable "Block leaked passwords"
*/

-- Add index for foreign key on submissions.dojo_id
-- This covers the submissions_dojo_id_fkey foreign key constraint
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id_fk 
ON public.submissions(dojo_id);
