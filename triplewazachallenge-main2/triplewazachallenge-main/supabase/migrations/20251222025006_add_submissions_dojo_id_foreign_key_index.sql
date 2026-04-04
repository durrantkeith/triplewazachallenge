/*
  # Add Foreign Key Index for Performance

  1. Performance Optimization
    - Add index on `submissions.dojo_id` to support the foreign key constraint
    - This index improves JOIN performance between submissions and dojos tables
    - Prevents table scans when querying submissions by dojo_id
    
  2. Important Notes
    - The foreign key `submissions_dojo_id_fkey` exists but lacks a covering index
    - Without this index, queries joining submissions and dojos can be slow
    - This is a critical performance optimization for the Hall of Fame queries
*/

-- Add index on submissions.dojo_id to support foreign key constraint
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id 
ON submissions(dojo_id);
