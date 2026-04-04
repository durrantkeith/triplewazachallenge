/*
  # Add Foreign Key Index for Performance

  ## Performance Improvements
  1. Index on submissions.dojo_id
     - Creates index `idx_submissions_dojo_id` to support the foreign key constraint
     - Dramatically improves JOIN performance between submissions and dojos tables
     - Optimizes queries that filter or sort by dojo_id
     - Essential for maintaining good performance as data volume grows

  ## Impact
  - Resolves the "Unindexed foreign keys" security warning
  - Improves query performance for:
    - Lookups of submissions by dojo
    - Foreign key constraint validation
    - CASCADE operations on the foreign key
  
  ## Important Notes
  - Additional auth configuration changes (password protection, connection pooling) 
    must be configured through the Supabase Dashboard under Project Settings > Auth
*/

-- Add index on submissions.dojo_id to support foreign key constraint
-- This index is critical for performance when joining or filtering by dojo_id
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id ON public.submissions(dojo_id);
