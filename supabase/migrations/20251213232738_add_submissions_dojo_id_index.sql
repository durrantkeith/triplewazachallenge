/*
  # Add Foreign Key Index for Performance

  1. Performance Optimization
    - Add index `idx_submissions_dojo_id` on submissions(dojo_id) column
    - This covers the foreign key constraint `submissions_dojo_id_fkey`
    - Improves query performance for joins and lookups by dojo_id
    
  2. Why This Is Needed
    - PostgreSQL does NOT automatically create indexes on the referencing side of foreign keys
    - Without this index, queries filtering or joining on dojo_id will require full table scans
    - This is especially important for queries that fetch submissions by dojo
    
  3. Security & Performance
    - Resolves the "Unindexed foreign keys" security warning
    - Dramatically improves performance for dojo-related queries
*/

-- Create index on the foreign key column to improve query performance
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id ON submissions(dojo_id);
