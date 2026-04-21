/*
  # Drop Unused Indexes

  Removes indexes that have not been used and are consuming resources without benefit.

  ## Indexes Dropped
  - `idx_kata_sets_kata_id` on `public.kata_sets`
  - `idx_music_settings_updated_by` on `public.music_settings`
  - `idx_submissions_dojo_id` on `public.submissions`
*/

DROP INDEX IF EXISTS public.idx_kata_sets_kata_id;
DROP INDEX IF EXISTS public.idx_music_settings_updated_by;
DROP INDEX IF EXISTS public.idx_submissions_dojo_id;
