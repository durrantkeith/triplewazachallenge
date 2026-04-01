/*
  # Drop Unused Index
  
  1. Index Removal
    - Drop `idx_submissions_dojo_id` on the submissions table
    - This index is currently unused and can be recreated later if needed
  
  ## Security Note
  The submissions table has a foreign key to dojos(id), but the index on dojo_id
  is not currently being used by any queries. If performance issues arise with
  foreign key operations in the future, this index can be recreated.
*/

-- Drop the unused index
DROP INDEX IF EXISTS idx_submissions_dojo_id;