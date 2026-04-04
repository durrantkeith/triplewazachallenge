/*
  # Fix Security Issues Comprehensive
  
  1. Performance
    - Drop unused index `idx_submissions_dojo_id_fk` on submissions table
    
  2. Security - Remove Duplicate Permissive Policies
    - featured_dojos: Remove duplicate SELECT policies for authenticated users
      - Drop: "Anyone can view active featured dojos"
      - Keep: "Authenticated users can view all featured dojos"
    
    - newsletter_signups: Remove duplicate INSERT policies for anon users
      - Drop: "Anyone can signup for newsletter"
      - Keep: "Anyone can subscribe to newsletter"
    
    - testimonials: Remove duplicate SELECT policies
      - Drop: "Anyone can view active testimonials" (duplicate for both anon and authenticated)
      - Keep: "Public can view active, admins can view all testimonials" (covers both roles)
    
  3. Auth Security
    - Password breach protection must be enabled via Supabase Dashboard:
      Authentication > Settings > Enable "Password breach protection"
    
  Notes:
    - Consolidated policies provide the same access while eliminating redundancy
    - Password protection helps prevent use of compromised credentials
    - Removed index was not being utilized by query planner
*/

-- Drop unused index
DROP INDEX IF EXISTS idx_submissions_dojo_id_fk;

-- Fix featured_dojos duplicate policies
DROP POLICY IF EXISTS "Anyone can view active featured dojos" ON featured_dojos;

-- Fix newsletter_signups duplicate policies  
DROP POLICY IF EXISTS "Anyone can signup for newsletter" ON newsletter_signups;

-- Fix testimonials duplicate policies
DROP POLICY IF EXISTS "Anyone can view active testimonials" ON testimonials;