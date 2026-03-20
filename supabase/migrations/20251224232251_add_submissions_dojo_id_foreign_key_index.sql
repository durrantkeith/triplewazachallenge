/*
  # Add Foreign Key Index for Performance

  1. Performance Optimization
    - Add index on `submissions.dojo_id` to support foreign key constraint `submissions_dojo_id_fkey`
    - This index significantly improves query performance for:
      - JOIN operations between submissions and dojos tables
      - Foreign key constraint validation
      - Cascading operations (if any)
    
  2. Note
    - Without this index, queries involving the foreign key relationship can result in full table scans
    - This is a critical performance optimization for production workloads
*/

-- Create index on dojo_id column to support the foreign key constraint
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id_fk ON submissions(dojo_id);