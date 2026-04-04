/*
  # Fix Security Issues - Performance Indexes

  1. Performance Improvements
    - Add index for `kata_sets.kata_id` foreign key to improve join performance
    - Add index for `submissions.kata_set_id` foreign key to improve join performance
    - Drop unused index `idx_submissions_dojo_id_fk` to reduce storage overhead

  ## Important Notes
  - Foreign key indexes improve query performance for joins and cascading operations
  - Removing unused indexes reduces storage overhead and improves write performance
  
  ## Manual Configuration Required
  - Password leak detection (HaveIBeenPwned.org integration) must be enabled through 
    the Supabase Dashboard under Authentication > Settings > Auth Providers
*/

-- Add index for kata_sets.kata_id foreign key
CREATE INDEX IF NOT EXISTS idx_kata_sets_kata_id ON public.kata_sets(kata_id);

-- Add index for submissions.kata_set_id foreign key
CREATE INDEX IF NOT EXISTS idx_submissions_kata_set_id ON public.submissions(kata_set_id);

-- Drop unused index on submissions.dojo_id
DROP INDEX IF EXISTS idx_submissions_dojo_id_fk;