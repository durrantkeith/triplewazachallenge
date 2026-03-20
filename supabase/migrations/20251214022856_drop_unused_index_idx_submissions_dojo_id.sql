/*
  # Drop Unused Index

  1. Changes
    - Drop the unused index `idx_submissions_dojo_id` on the `submissions` table
    - This index is redundant because PostgreSQL automatically indexes foreign key columns for performance
    - The foreign key constraint `submissions_dojo_id_fkey` already provides the necessary indexing
    
  2. Security
    - No security changes
    - This is a performance optimization that removes an unused index
*/

DROP INDEX IF EXISTS idx_submissions_dojo_id;
