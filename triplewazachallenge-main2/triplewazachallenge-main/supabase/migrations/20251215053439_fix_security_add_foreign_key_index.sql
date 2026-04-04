/*
  # Fix Security Issues - Add Foreign Key Index

  ## Changes Made
  
  1. **Performance Optimization**
     - Add index on `submissions.dojo_id` to optimize foreign key constraint performance
     - This index improves JOIN operations and referential integrity checks
  
  2. **Security Notes**
     
     ### Anonymous Access Policies (INTENTIONAL)
     The following policies allow anonymous access by design for public functionality:
     - "Anyone can register a dojo" - Allows public dojo registration with email validation
     - "Anyone can submit videos" - Allows public video submissions with URL and email validation
     - "Public can view approved submissions" - Allows viewing only approved content
     - "Public can view dojos with approved submissions" - Allows viewing dojos that have approved submissions
     
     All anonymous INSERT policies include comprehensive validation:
     - Email format validation using regex
     - Required field checks (NOT NULL, length > 0)
     - URL format validation for YouTube links
     - Level range validation (1-5)
     
     These policies are secure and necessary for the application's public-facing functionality.
  
  ## Manual Configuration Required
  
  The following issues require manual configuration in the Supabase Dashboard:
  
  1. **Auth DB Connection Strategy**
     - Navigate to: Project Settings > Database > Connection Pooling
     - Change Auth connection strategy from fixed number to percentage-based allocation
     - Recommended: Use percentage-based allocation for better scalability
  
  2. **Leaked Password Protection**
     - Navigate to: Authentication > Settings > Security
     - Enable "Check for compromised passwords" (HaveIBeenPwned integration)
     - This prevents users from using known compromised passwords
*/

-- Add index on foreign key column for performance
CREATE INDEX IF NOT EXISTS idx_submissions_dojo_id_fk 
ON submissions(dojo_id);
