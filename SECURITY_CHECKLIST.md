# Security Checklist

## Database Security - Fixed ✅

All database security issues have been resolved via migration:
- ✅ Added index for `submissions.dojo_id` foreign key
- ✅ Removed unused indexes to improve performance
- ✅ All foreign keys have proper covering indexes

## Auth Security - Action Required ⚠️

### Enable Password Breach Protection

Password breach protection is currently **DISABLED** and must be enabled manually in the Supabase dashboard.

**Steps to enable:**

1. Log in to your Supabase dashboard
2. Navigate to: **Authentication → Settings**
3. Scroll to **Security and Protection**
4. Enable **"Password breach protection"**
5. Save changes

**What this does:**
- Checks new passwords against the HaveIBeenPwned.org database
- Prevents users from using compromised passwords
- Significantly improves account security

**Note:** This setting cannot be enabled via SQL migrations and must be configured through the Supabase dashboard interface.
