# Supabase Auth Configuration

## Leaked Password Protection

To complete the security configuration, you need to manually enable leaked password protection in the Supabase Dashboard. This setting cannot be configured via SQL migrations.

### Steps to Enable:

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** > **Policies** (or **Settings** > **Auth**)
4. Find the **Password Protection** section
5. Enable **"Check passwords against HaveIBeenPwned.org database"**
6. Save changes

### What This Does:

This feature prevents users from setting passwords that have been compromised in known data breaches by checking against the HaveIBeenPwned.org database. This significantly enhances account security without adding friction to the user experience.

### Status:

- ✅ Database index optimized (unused index removed)
- ✅ Function search path secured
- ⚠️ **MANUAL STEP REQUIRED**: Enable leaked password protection in Supabase Dashboard

---

*Note: All SQL-based security fixes have been applied via migration `fix_security_issues_final_v2`*
