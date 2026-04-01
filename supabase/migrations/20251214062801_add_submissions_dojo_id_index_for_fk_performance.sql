/*
  # Add Index for Foreign Key Performance
  
  1. Performance Improvement
    - Add index on `submissions.dojo_id` to support the foreign key constraint
    - This improves query performance for JOIN operations and foreign key checks
    - Resolves the "Unindexed foreign keys" security issue
  
  2. Impact
    - Speeds up queries that join submissions with dojos
    - Improves performance of foreign key constraint validation
    - Reduces database load for common query patterns
*/

-- Add index on dojo_id foreign key column for better performance
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id_fk 
ON submissions(dojo_id);