/*
  # Add Foreign Key Index for Performance

  ## Overview
  This migration adds a missing index on the `dojo_id` column in the `submissions` table to optimize foreign key constraint performance.

  ## Changes

  ### Performance Optimization
  - **Add Index**: Creates `idx_submissions_dojo_id` on `submissions(dojo_id)`
    - Covers the foreign key `submissions_dojo_id_fkey`
    - Improves query performance for:
      - JOIN operations between submissions and dojos tables
      - Foreign key constraint checks on INSERT/UPDATE/DELETE
      - Queries filtering by dojo_id
    - Essential for maintaining optimal database performance as data grows

  ## Important Notes
  - Index creation uses `IF NOT EXISTS` for idempotency
  - This is a non-blocking operation that can be run safely
  - No data changes are made, only structure optimization
*/

-- Add index on dojo_id to optimize foreign key performance
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id ON public.submissions(dojo_id);