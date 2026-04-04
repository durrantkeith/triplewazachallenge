/*
  # Fix Foreign Key Index Performance Issue

  1. Foreign Key Index
    - Re-add index on `submissions.dojo_id` for optimal foreign key query performance
    - This index was previously removed but is needed for foreign key constraint queries
    - Improves JOIN performance between submissions and dojos tables
    - Prevents suboptimal query performance warnings
  
  2. Performance Impact
    - Faster queries when joining submissions with dojos
    - Better performance for foreign key constraint checks
    - Improved query execution plans for related table lookups
  
  3. Notes
    - Foreign key columns should generally be indexed for optimal performance
    - This is especially important for tables with many rows or frequent joins
*/

-- Re-add index on dojo_id for foreign key constraint performance
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id ON submissions(dojo_id);