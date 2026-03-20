/*
  # Fix Security Issues - Drop Unused Index

  1. Changes
    - Drop unused index `idx_submissions_dojo_id` on `submissions` table
    - This index has not been used and is redundant
    - Foreign key constraint already provides necessary performance optimization

  2. Security Impact
    - Reduces unused database objects
    - Simplifies database maintenance
    - No impact on query performance as the index is unused

  Note: The foreign key constraint `submissions_dojo_id_fkey` already creates
  an implicit index for the relationship, making this explicit index redundant.
*/

-- Drop the unused index
DROP INDEX IF EXISTS idx_submissions_dojo_id;
