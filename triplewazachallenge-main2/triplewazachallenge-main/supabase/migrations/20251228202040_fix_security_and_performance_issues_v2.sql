/*
  # Fix Security and Performance Issues

  1. Performance Improvements
    - Add index for foreign key `submissions_dojo_id_fkey` to improve query performance
    - Drop unused index `idx_kata_sets_kata_id` on `kata_sets` table
    - Drop unused index `idx_submissions_kata_set_id` on `submissions` table

  ## Changes
  - Creates `idx_submissions_dojo_id` index on `submissions(dojo_id)` for foreign key performance
  - Removes unused indexes that add overhead without benefit

  ## Note on Password Protection
  The leaked password protection feature must be enabled through Supabase Dashboard:
  Authentication > Providers > Email > Advanced Settings > Enable "Secure Password"
  This checks passwords against HaveIBeenPwned.org database to prevent compromised passwords.
*/

-- Add index for foreign key submissions_dojo_id_fkey
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id ON public.submissions(dojo_id);

-- Drop unused index on kata_sets table
DROP INDEX IF EXISTS public.idx_kata_sets_kata_id;

-- Drop unused index on submissions table
DROP INDEX IF EXISTS public.idx_submissions_kata_set_id;