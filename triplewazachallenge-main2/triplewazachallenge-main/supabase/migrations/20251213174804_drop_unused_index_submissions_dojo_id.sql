/*
  # Drop Unused Index

  1. Performance Optimization
    - Drop unused index `idx_submissions_dojo_id` on submissions table
    - The foreign key constraint on dojo_id provides sufficient indexing
    - This index has not been used by any queries

  2. Notes
    - Foreign key constraints automatically create indexes when needed
    - Removing unused indexes improves write performance and reduces storage
*/

-- Drop the unused index
DROP INDEX IF EXISTS idx_submissions_dojo_id;
