/*
  # Drop Unused Index and Security Enhancement
  
  1. Changes
    - Drop unused index `idx_submissions_dojo_id` on submissions table
      - This index has not been used according to database statistics
      - The foreign key constraint is sufficient for integrity
    
  2. Notes
    - The foreign key constraint `submissions_dojo_id_fkey` remains in place for referential integrity
    - Password breach protection must be enabled in Supabase Dashboard settings (cannot be set via SQL)
*/

-- Drop the unused index
DROP INDEX IF EXISTS idx_submissions_dojo_id;
