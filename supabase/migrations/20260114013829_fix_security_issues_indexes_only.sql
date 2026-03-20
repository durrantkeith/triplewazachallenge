/*
  # Fix Security Issues - Index Optimization

  1. Performance Optimization
    - Add index on `submissions.dojo_id` for foreign key performance
    - Drop unused index `idx_kata_sets_kata_id_fk` on `kata_sets`

  Important Notes:
  - The index on submissions.dojo_id improves query performance for foreign key lookups
  - Removing unused indexes reduces database overhead and maintenance costs
  - Foreign key indexes are critical for optimal join and cascade operation performance
*/

-- Add index for foreign key on submissions.dojo_id
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id_fk_performance 
ON submissions(dojo_id);

-- Drop unused index on kata_sets
DROP INDEX IF EXISTS idx_kata_sets_kata_id_fk;
