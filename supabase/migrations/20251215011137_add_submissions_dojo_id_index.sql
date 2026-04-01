/*
  # Add index for foreign key on submissions.dojo_id

  1. Performance Improvement
    - Add index on `submissions.dojo_id` to improve foreign key constraint performance
    - This index will speed up:
      * JOIN operations between submissions and dojos tables
      * CASCADE operations when dojos are deleted
      * Queries filtering submissions by dojo_id
  
  2. Security Fix
    - Addresses the "Unindexed foreign keys" security warning
    - Improves overall database performance and prevents potential slowdowns
*/

-- Add index on dojo_id foreign key column
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id ON submissions(dojo_id);
