/*
  # Add Index for Foreign Key Performance

  1. Changes
    - Add index on `submissions.dojo_id` to support the foreign key constraint
    - This improves query performance when joining submissions with dojos
  
  2. Performance Impact
    - Enhances JOIN operations between submissions and dojos tables
    - Improves foreign key constraint validation performance
    - Optimizes queries filtering by dojo_id
  
  3. Notes
    - Foreign keys should always have covering indexes for optimal performance
    - This prevents table scans when querying related records
*/

CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id_fk ON submissions(dojo_id);
