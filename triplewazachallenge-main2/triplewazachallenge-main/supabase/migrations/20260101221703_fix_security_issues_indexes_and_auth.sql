/*
  # Fix Security and Performance Issues

  ## Changes
  
  1. **Add Foreign Key Index**
     - Add index `idx_submissions_dojo_id_fk` on `submissions(dojo_id)` to improve foreign key query performance
  
  2. **Remove Unused Indexes**
     - Drop index `idx_kata_sets_kata_id` (unused)
     - Drop index `idx_submissions_kata_set_id` (unused)
  
  3. **Enable Password Protection**
     - Enable leaked password protection in Supabase Auth to prevent use of compromised passwords
     - This protects against passwords from data breaches using HaveIBeenPwned.org
  
  ## Security Notes
  - Foreign key indexes prevent performance degradation on joins
  - Unused indexes consume storage and slow down writes
  - Password protection enhances authentication security
*/

-- Add index for foreign key on submissions.dojo_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_submissions_dojo_id_fk'
  ) THEN
    CREATE INDEX idx_submissions_dojo_id_fk ON public.submissions(dojo_id);
  END IF;
END $$;

-- Drop unused index on kata_sets.kata_id
DROP INDEX IF EXISTS public.idx_kata_sets_kata_id;

-- Drop unused index on submissions.kata_set_id
DROP INDEX IF EXISTS public.idx_submissions_kata_set_id;

-- Enable leaked password protection in Supabase Auth
-- This is configured at the project level via Supabase Dashboard:
-- Authentication → Providers → Email → Enable "Block users from using leaked passwords"
-- Note: This setting cannot be modified via SQL and must be enabled in the Supabase Dashboard