/*
  # Fix Foreign Key Indexes and Remove Unused Index

  ## Changes Made

  1. **Add Foreign Key Indexes**
     - Add index on `kata_sets.kata_id` to improve performance of foreign key lookups
     - Add index on `submissions.kata_set_id` to improve performance of foreign key lookups

  2. **Remove Unused Index**
     - Drop `idx_submissions_dojo_id` which is not being used

  ## Performance Impact
  - Improved query performance on foreign key relationships
  - Cleaner index structure by removing unused index
*/

-- Add index for kata_sets.kata_id foreign key
CREATE INDEX IF NOT EXISTS idx_kata_sets_kata_id ON kata_sets(kata_id);

-- Add index for submissions.kata_set_id foreign key
CREATE INDEX IF NOT EXISTS idx_submissions_kata_set_id ON submissions(kata_set_id);

-- Drop unused index on submissions.dojo_id
DROP INDEX IF EXISTS idx_submissions_dojo_id;