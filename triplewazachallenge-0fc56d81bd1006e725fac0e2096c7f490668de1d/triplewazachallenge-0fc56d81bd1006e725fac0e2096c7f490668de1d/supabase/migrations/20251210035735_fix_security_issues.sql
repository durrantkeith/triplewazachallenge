/*
  # Fix Security Issues

  1. Performance & Security
    - Recreate index on `submissions.dojo_id` to cover foreign key constraint
      - Prevents suboptimal query performance on foreign key joins
      - Essential for maintaining query performance as data grows
      - Improves foreign key constraint check performance
  
  2. Important Notes
    - The index was previously dropped but is actually required for optimal foreign key performance
    - Foreign keys without covering indexes can lead to full table scans
    - This is a critical security and performance fix
*/

-- Recreate index on submissions.dojo_id to cover the foreign key
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id ON public.submissions(dojo_id);
