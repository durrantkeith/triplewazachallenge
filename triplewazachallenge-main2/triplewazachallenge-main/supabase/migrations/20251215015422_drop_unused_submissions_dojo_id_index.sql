/*
  # Drop unused index on submissions.dojo_id

  1. Index Cleanup
    - Drop `idx_submissions_dojo_id` index on submissions table
    - Supabase advisory reports this index is not being used by the query optimizer
    - The foreign key constraint `submissions_dojo_id_fkey` already exists and provides necessary referential integrity
    - PostgreSQL can still enforce the foreign key without this index (though it may be slower for large tables)

  2. Performance Note
    - For the current table size, the query planner determines this index provides no performance benefit
    - If the submissions table grows significantly, this index may need to be re-added
*/

DROP INDEX IF EXISTS idx_submissions_dojo_id;
