/*
  # Add Performance Indexes for Scalability

  1. Performance Improvements
    - Add composite index on (status, submitted_at) for efficient filtering and sorting
    - Add index on country for search operations
    - Add index on email for admin search
    - Add index on level for filtering
    - Add index on approved_at for analytics queries

  2. Notes
    - These indexes significantly improve query performance for:
      - Hall of Fame pagination with status filtering
      - Admin dashboard filtering and search
      - Analytics and statistics generation
    - Trade-off: Slightly slower writes, much faster reads
    - For a read-heavy application like this, this is the right choice
*/

-- Composite index for most common query pattern (status + sorting by date)
CREATE INDEX IF NOT EXISTS idx_submissions_status_submitted_at 
  ON submissions(status, submitted_at DESC);

-- Index for country searches and grouping
CREATE INDEX IF NOT EXISTS idx_submissions_country 
  ON submissions(country);

-- Index for level filtering
CREATE INDEX IF NOT EXISTS idx_submissions_level 
  ON submissions(level);

-- Index for email searches (admin dashboard)
CREATE INDEX IF NOT EXISTS idx_submissions_email 
  ON submissions(email);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_submissions_approved_at 
  ON submissions(approved_at) 
  WHERE approved_at IS NOT NULL;

-- Composite index for country + status (Hall of Fame queries)
CREATE INDEX IF NOT EXISTS idx_submissions_country_status 
  ON submissions(country, status);