/*
  # Drop Unused Indexes

  1. Changes
    - Drop `idx_submissions_dojo_id` index on submissions table (unused)
    - Drop `educational_videos_category_order_idx` index on educational_videos table (unused)
  
  2. Performance Impact
    - Removing unused indexes improves write performance and reduces storage overhead
    - These indexes are not being utilized by current queries
*/

DROP INDEX IF EXISTS idx_submissions_dojo_id;
DROP INDEX IF EXISTS educational_videos_category_order_idx;
