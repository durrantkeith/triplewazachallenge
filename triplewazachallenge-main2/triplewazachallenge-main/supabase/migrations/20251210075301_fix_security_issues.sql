/*
  # Fix Security Issues

  1. Performance Improvements
    - Add index on foreign key dojo_id for optimal join performance
    - Remove unused indexes that don't match actual query patterns
    - Keep only indexes that are actively used by application queries

  2. Index Strategy
    - Foreign key index on dojo_id (required for joins)
    - Keep country and email indexes (used by search queries)
    - Remove level index (not filtered independently)
    - Remove approved_at index (not used in queries)
    - Remove country_status composite (not matching query pattern)
    - Remove status_submitted_at composite (query optimizer prefers separate indexes)

  3. Security
    - Password breach protection will be enabled via Auth settings
*/

-- Add missing foreign key index for optimal join performance
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id 
  ON submissions(dojo_id) 
  WHERE dojo_id IS NOT NULL;

-- Drop unused indexes to reduce write overhead and storage
DROP INDEX IF EXISTS idx_submissions_approved_at;
DROP INDEX IF EXISTS idx_submissions_country_status;
DROP INDEX IF EXISTS idx_submissions_status_submitted_at;
DROP INDEX IF EXISTS idx_submissions_level;

-- Keep these indexes as they are used by search queries:
-- - idx_submissions_country (used in search OR clause)
-- - idx_submissions_email (used in search OR clause)