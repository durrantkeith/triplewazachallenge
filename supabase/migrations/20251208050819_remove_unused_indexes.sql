/*
  # Remove Unused Indexes

  ## Changes
  1. **Drop Unused Indexes**
     - Remove `idx_dojos_province_state` from dojos table (not being used in queries)
     - Remove `idx_submissions_dojo_id` from submissions table (foreign key provides sufficient indexing)
     - Remove `idx_submissions_level` from submissions table (not being used in queries)
  
  ## Performance Improvements
  - Reduces database overhead by removing unnecessary indexes
  - Improves write performance (inserts/updates) on these tables
  - Maintains only actively used indexes for optimal query performance
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_dojos_province_state;
DROP INDEX IF EXISTS idx_submissions_dojo_id;
DROP INDEX IF EXISTS idx_submissions_level;
