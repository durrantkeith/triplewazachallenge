/*
  # Add Foreign Key Index for Performance

  1. Database Optimization
    - Add index on `submissions.dojo_id` to optimize foreign key queries
    - This index is required for optimal JOIN performance between submissions and dojos tables
    - Prevents suboptimal query performance warnings from Supabase security scanner
    - Improves foreign key constraint check performance
  
  2. Performance Benefits
    - Faster queries when filtering submissions by dojo_id
    - Improved JOIN performance between submissions and dojos tables
    - Better query execution plans for foreign key constraint checks
    - Reduced table scan overhead for related table lookups
  
  3. Important Notes
    - Foreign key columns should always be indexed unless there's a specific reason not to
    - This is a standard database best practice for relational data integrity
    - The index improves both read and foreign key validation performance
*/

-- Create index on submissions.dojo_id for foreign key constraint performance
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id ON public.submissions(dojo_id);
