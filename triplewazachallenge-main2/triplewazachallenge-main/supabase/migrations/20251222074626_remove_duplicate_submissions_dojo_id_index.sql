/*
  # Remove Duplicate Index

  1. Changes
    - Drop duplicate index `idx_submissions_dojo_id` 
    - Keep `idx_submissions_dojo_id_fk` as the primary index for the foreign key
  
  2. Reason
    - Both indexes are identical and redundant
    - Keeping only one reduces storage overhead and maintenance cost
    - The foreign key index is sufficient for query optimization
  
  3. Performance Impact
    - Reduces unnecessary index maintenance during INSERT/UPDATE/DELETE operations
    - Frees up storage space
    - No negative impact on query performance as the remaining index serves the same purpose
*/

DROP INDEX IF EXISTS idx_submissions_dojo_id;
