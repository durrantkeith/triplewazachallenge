/*
  # Add Index for Foreign Key on submissions.dojo_id

  1. Performance Optimization
    - Creates index `idx_submissions_dojo_id` on submissions(dojo_id) column
    - This index covers the foreign key constraint `submissions_dojo_id_fkey`
    - Improves query performance for JOINs between submissions and dojos tables
    - Optimizes queries that filter or sort by dojo_id
    
  2. Security & Best Practices
    - Foreign keys without covering indexes can cause performance degradation
    - This index ensures optimal query execution plans
    - Reduces database load during relationship queries
*/

-- Add index to cover the foreign key constraint on submissions.dojo_id
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id ON public.submissions(dojo_id);
