/*
  # Add Index for Foreign Key on submissions.dojo_id

  1. Changes
    - Add index on `submissions.dojo_id` to support the foreign key constraint
    - This index is essential for optimal performance when:
      * Joining submissions with dojos
      * Updating or deleting dojo records (checks related submissions)
      * Enforcing referential integrity

  2. Performance Impact
    - Improves query performance for joins between submissions and dojos
    - Speeds up foreign key constraint validation
    - Critical for maintaining good performance as data grows

  3. Security Impact
    - Ensures efficient enforcement of referential integrity
    - Prevents performance degradation that could lead to availability issues
*/

-- Create index on the foreign key column to improve query performance
-- and foreign key constraint enforcement
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id ON submissions(dojo_id);
