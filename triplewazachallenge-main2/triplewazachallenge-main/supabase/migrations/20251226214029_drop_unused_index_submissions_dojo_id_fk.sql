/*
  # Drop Unused Index

  1. Performance Optimization
    - Drop unused index `idx_submissions_dojo_id_fk` on `submissions` table
    - This index has not been used and creates unnecessary overhead
    - PostgreSQL automatically creates an index for foreign keys when needed for constraint checking

  ## Notes
  - The foreign key constraint on submissions.dojo_id remains intact
  - PostgreSQL's query planner will use the foreign key's built-in indexing
*/

-- Drop unused index on submissions table
DROP INDEX IF EXISTS idx_submissions_dojo_id_fk;