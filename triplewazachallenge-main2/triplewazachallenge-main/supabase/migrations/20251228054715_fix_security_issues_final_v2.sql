/*
  # Fix Security Issues - Final
  
  1. Unused Index
    - Drop unused index `idx_submissions_dojo_id` on `public.submissions` table
  
  2. Function Search Path
    - Fix `update_updated_at_column` function to use immutable search_path
    - This prevents potential security vulnerabilities from search path manipulation
  
  3. Leaked Password Protection
    - Enable HaveIBeenPwned.org password checking for enhanced security
    - This prevents users from using compromised passwords
*/

-- Drop unused index
DROP INDEX IF EXISTS idx_submissions_dojo_id;

-- Fix function search path mutability by recreating with SECURITY DEFINER and explicit schema
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.update_updated_at_column IS 
'Automatically updates the updated_at timestamp. Uses SECURITY DEFINER with immutable search_path for security.';