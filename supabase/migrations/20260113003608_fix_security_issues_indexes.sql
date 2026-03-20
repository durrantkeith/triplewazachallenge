/*
  # Fix Security and Performance Issues

  ## Changes
  1. **Add Foreign Key Indexes**
     - Add index on `kata_sets.kata_id` for foreign key performance
     - Add index on `submissions.kata_set_id` for foreign key performance
  
  2. **Remove Unused Index**
     - Drop unused index `idx_submissions_dojo_id_fk` on `submissions` table
  
  ## Security Notes
  - Foreign key indexes improve query performance and prevent table scans
  - Removing unused indexes reduces storage overhead and improves write performance
  
  ## Password Protection
  - Leaked password protection must be enabled through Supabase Dashboard:
    - Go to Authentication > Settings
    - Enable "Leaked password protection" option
    - This checks passwords against HaveIBeenPwned.org database
*/

-- Add index for kata_sets.kata_id foreign key
CREATE INDEX IF NOT EXISTS idx_kata_sets_kata_id_fk ON public.kata_sets(kata_id);

-- Add index for submissions.kata_set_id foreign key
CREATE INDEX IF NOT EXISTS idx_submissions_kata_set_id_fk ON public.submissions(kata_set_id);

-- Drop unused index on submissions.dojo_id
DROP INDEX IF EXISTS public.idx_submissions_dojo_id_fk;