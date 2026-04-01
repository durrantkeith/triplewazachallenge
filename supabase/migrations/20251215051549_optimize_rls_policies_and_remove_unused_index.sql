/*
  # Optimize RLS Policies and Remove Unused Index

  This migration addresses performance and maintenance issues:

  1. **RLS Policy Optimization**
     - Updates policies on `dojos`, `educational_videos`, and `submissions` tables
     - Wraps `auth.uid()` calls with `(select auth.uid())` to prevent re-evaluation per row
     - Improves query performance at scale by caching the auth function result
     - Affected policies:
       * dojos: "Authenticated users can update dojos"
       * educational_videos: "Authenticated users can insert educational videos"
       * educational_videos: "Authenticated users can delete educational videos"
       * submissions: "Authenticated users can update submissions"
       * submissions: "Authenticated users can delete submissions"

  2. **Index Cleanup**
     - Drops unused index `idx_submissions_dojo_id_fk` on `submissions.dojo_id`
     - This index has not been utilized by query planner

  ## Security
  - All policies maintain the same security restrictions
  - Only the performance optimization technique is applied
  - No changes to access control logic
*/

-- Drop and recreate the dojos update policy with optimized auth check
DROP POLICY IF EXISTS "Authenticated users can update dojos" ON dojos;
CREATE POLICY "Authenticated users can update dojos"
  ON dojos
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Drop and recreate the educational_videos insert policy with optimized auth check
DROP POLICY IF EXISTS "Authenticated users can insert educational videos" ON educational_videos;
CREATE POLICY "Authenticated users can insert educational videos"
  ON educational_videos
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Drop and recreate the educational_videos delete policy with optimized auth check
DROP POLICY IF EXISTS "Authenticated users can delete educational videos" ON educational_videos;
CREATE POLICY "Authenticated users can delete educational videos"
  ON educational_videos
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- Drop and recreate the submissions update policy with optimized auth check
DROP POLICY IF EXISTS "Authenticated users can update submissions" ON submissions;
CREATE POLICY "Authenticated users can update submissions"
  ON submissions
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- Drop and recreate the submissions delete policy with optimized auth check
DROP POLICY IF EXISTS "Authenticated users can delete submissions" ON submissions;
CREATE POLICY "Authenticated users can delete submissions"
  ON submissions
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- Drop the unused index on submissions.dojo_id
DROP INDEX IF EXISTS idx_submissions_dojo_id_fk;
