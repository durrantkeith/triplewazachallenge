/*
  # Fix Security and Performance Issues

  1. Performance Improvements
    - Add index on `submissions.dojo_id` to support foreign key constraint
    - Optimize RLS policy to use subquery for auth.uid() evaluation
    - Remove unused index on educational_videos

  2. Changes Made
    - Add `idx_submissions_dojo_id` index for foreign key performance
    - Update RLS policy to use `(select auth.uid())` for better performance at scale
    - Drop unused index `idx_educational_videos_level_order`

  3. Security Notes
    - RLS policies remain restrictive and secure
    - Performance optimization does not compromise security
    - Authenticated users can view all submissions (existing behavior preserved)
    - Anonymous users can only view approved submissions
*/

-- Add index on submissions.dojo_id for foreign key constraint performance
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id ON submissions(dojo_id);

-- Drop and recreate the RLS policy with optimized auth function call
DROP POLICY IF EXISTS "Anyone can view approved submissions" ON submissions;

CREATE POLICY "Anyone can view approved submissions"
  ON submissions
  FOR SELECT
  USING (
    status = 'approved' OR 
    (select auth.uid()) IS NOT NULL
  );

-- Drop unused index on educational_videos
DROP INDEX IF EXISTS idx_educational_videos_level_order;
