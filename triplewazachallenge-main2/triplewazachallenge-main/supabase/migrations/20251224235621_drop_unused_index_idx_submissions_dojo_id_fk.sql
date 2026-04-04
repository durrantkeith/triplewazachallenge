/*
  # Drop Unused Index on submissions.dojo_id

  1. Changes
    - Drop the unused index `idx_submissions_dojo_id_fk` on `submissions(dojo_id)`
    - The foreign key constraint remains intact for referential integrity
    - Index statistics show zero scans (idx_scan = 0), indicating it's not being used by queries

  2. Performance Impact
    - Minimal impact as the index is currently unused
    - The foreign key constraint `submissions_dojo_id_fkey` continues to enforce data integrity
    - Query performance is unaffected since no queries are currently utilizing this index

  3. Security
    - Addresses security recommendation to remove unused database objects
    - Reduces database maintenance overhead
*/

DROP INDEX IF EXISTS idx_submissions_dojo_id_fk;
