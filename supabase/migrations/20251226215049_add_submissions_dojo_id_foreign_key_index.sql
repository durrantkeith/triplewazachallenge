/*
  # Add Foreign Key Index for Performance

  1. Performance Optimization
    - Add index on `submissions.dojo_id` to cover the foreign key constraint
    - This improves JOIN performance and foreign key constraint checking
    - Prevents table scans when querying submissions by dojo

  ## Notes
  - Foreign keys without indexes can cause performance issues on JOINs and DELETE operations
  - This index will be used when filtering or joining submissions by dojo_id
*/

-- Add index on submissions.dojo_id to cover the foreign key
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id ON public.submissions(dojo_id);