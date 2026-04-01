/*
  # Remove Unused Index

  1. Database Optimization
    - Drop `idx_submissions_dojo_id` index that is not being utilized
    - This index was intended to optimize foreign key queries but is not being used by the query planner
    - Removing it reduces maintenance overhead and storage without impacting performance

  ## Important Notes
  - The foreign key constraint `submissions_dojo_id_fkey` remains intact
  - PostgreSQL automatically creates indexes for foreign keys when beneficial
  - This change only removes the explicitly created redundant index
*/

-- Drop unused index on submissions.dojo_id
DROP INDEX IF EXISTS idx_submissions_dojo_id;