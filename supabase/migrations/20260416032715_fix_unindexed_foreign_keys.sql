/*
  # Fix Unindexed Foreign Keys

  ## Summary
  Adds missing indexes for foreign key columns to improve query performance.

  ## Changes
  1. `public.kata_sets` - Add index on `kata_id` column (kata_sets_kata_id_fkey)
  2. `public.music_settings` - Add index on `updated_by` column (music_settings_updated_by_fkey)
  3. `public.submissions` - Add index on `dojo_id` column (submissions_dojo_id_fkey)

  ## Notes
  - Uses IF NOT EXISTS to safely skip if indexes already exist
  - These indexes support foreign key constraint lookups and improve JOIN performance
*/

CREATE INDEX IF NOT EXISTS idx_kata_sets_kata_id ON public.kata_sets(kata_id);
CREATE INDEX IF NOT EXISTS idx_music_settings_updated_by ON public.music_settings(updated_by);
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id ON public.submissions(dojo_id);
