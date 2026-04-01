/*
  # Remove Unused Index

  1. Changes
    - Drop `idx_submissions_dojo_id` index from submissions table
  
  2. Security Impact
    - Removing unused indexes improves write performance
    - Reduces storage overhead and maintenance costs
    - Eliminates security scan warning for unused index
  
  3. Notes
    - This index is not being utilized by current queries
    - The foreign key constraint on dojo_id does not require this index
*/

DROP INDEX IF EXISTS idx_submissions_dojo_id;
