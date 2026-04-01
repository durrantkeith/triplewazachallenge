/*
  # Drop Unused Index

  1. Changes
    - Drop unused index `idx_submissions_dojo_id` on `submissions` table
    - This index has not been used and is consuming unnecessary resources
  
  2. Notes
    - The foreign key constraint `submissions_dojo_id_fkey` already provides necessary indexing
    - Removing unused indexes improves write performance and reduces storage overhead
*/

DROP INDEX IF EXISTS idx_submissions_dojo_id;
