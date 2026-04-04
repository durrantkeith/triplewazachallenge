/*
  # Add Index for Foreign Key on submissions.dojo_id

  ## Changes Made
  
  1. **Add Index on submissions.dojo_id**
     - Creates index `idx_submissions_dojo_id` to cover the foreign key constraint
     - This index is essential for optimal foreign key constraint performance
     - Prevents full table scans during CASCADE operations and constraint validation
  
  ## Why This Index Is Critical
  
  Foreign keys without indexes cause:
  - Slow foreign key constraint validation
  - Table locks during UPDATE/DELETE operations on the referenced table (dojos)
  - Performance degradation during CASCADE operations
  - Inefficient JOIN operations between submissions and dojos tables
  
  Even if not actively used in application queries, this index is crucial for
  database integrity operations and overall system performance.
  
  ## Performance Impact
  
  - Improves foreign key constraint validation speed
  - Prevents table locks on the dojos table
  - Optimizes JOIN performance between submissions and dojos
  - Speeds up CASCADE operations
*/

-- Add index on dojo_id foreign key column
-- This is required for optimal foreign key constraint performance
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id ON public.submissions(dojo_id);