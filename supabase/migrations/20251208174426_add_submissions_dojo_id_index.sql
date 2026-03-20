/*
  # Add Index for Foreign Key Performance
  
  1. Performance Optimization
    - Add index on `submissions.dojo_id` to cover the foreign key constraint
      - Improves query performance for joins between submissions and dojos
      - Optimizes foreign key constraint checks
      - Prevents performance degradation as the submissions table grows
  
  ## Important Notes
  - The index is created with `IF NOT EXISTS` to prevent errors on re-runs
  - This index will significantly improve queries that filter or join on dojo_id
*/

-- Add index on submissions.dojo_id to cover the foreign key
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id ON submissions(dojo_id);