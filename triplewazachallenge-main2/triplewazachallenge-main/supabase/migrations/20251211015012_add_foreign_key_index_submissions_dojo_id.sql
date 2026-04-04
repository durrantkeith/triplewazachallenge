/*
  # Add Index for Foreign Key Performance

  ## Changes Made
  
  1. **Add Index on submissions.dojo_id**
     - Creates index `idx_submissions_dojo_id` to cover the foreign key constraint
     - This index improves JOIN performance between submissions and dojos tables
     - Prevents full table scans when querying submissions by dojo
  
  ## Performance Impact
  
  - Significantly improves query performance for:
    - JOINs between submissions and dojos tables
    - Queries filtering submissions by dojo_id
    - Foreign key constraint validation
    - CASCADE operations on the foreign key
  
  ## Why This Index Is Needed
  
  Foreign keys without indexes can cause:
  - Slow JOIN operations
  - Table locks during updates/deletes on referenced table
  - Poor query performance when filtering by foreign key
  
  PostgreSQL does not automatically create indexes on foreign key columns,
  so we must add them manually for optimal performance.
*/

-- Add index on dojo_id foreign key column for optimal query performance
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id ON public.submissions(dojo_id);