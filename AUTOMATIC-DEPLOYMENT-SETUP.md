# Automatic Deployment Setup for Cloudflare Pages

This guide will set up automatic deployments so that every time you push changes to GitHub, your site at https://triplewazachallenge.com automatically updates.

## Prerequisites

- A GitHub account
- Your Cloudflare account (already set up)
- Git installed on your computer

---

## Step 1: Initialize Git Repository

Run these commands in your project directory:

```bash
git init
git add .
git commit -m "Initial commit - Triple Waza Challenge"
```

---

## Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository:
   - **Name**: `triple-waza-challenge` (or your preferred name)
   - **Visibility**: Public or Private (your choice)
   - **DO NOT** check "Initialize with README" (we already have code)
3. Click **Create repository**

---

## Step 3: Connect Local Repository to GitHub

After creating the GitHub repository, you'll see commands on the screen. Run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/triple-waza-challenge.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 4: Connect Cloudflare Pages to GitHub

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages**
3. If you already have a project:
   - Click on your project
   - Go to **Settings** → **Builds & deployments**
   - Under **Source**, click **Configure** or **Connect to Git**
4. If creating new project:
   - Click **Create a project**
   - Click **Connect to Git**

5. Authorize Cloudflare to access your GitHub account
6. Select your `triple-waza-challenge` repository
7. Configure build settings:
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: (leave empty)

---

## Step 5: Add Environment Variables

In your Cloudflare Pages project settings:

1. Go to **Settings** → **Environment variables**
2. Add these variables for **Production**:

```
VITE_SUPABASE_URL=https://mhjdzgzyqlvdubmxqvio.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oamR6Z3p5cWx2ZHVibXhxdmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDUwNTQsImV4cCI6MjA4MDc4MTA1NH0.V_8FyZ_L3blv_sYNudvQsmrAm8S4ccUMNyJoMAZ-J8w
```

3. Click **Save**

---

## Step 6: Configure Custom Domain (if not already done)

1. In your Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `triplewazachallenge.com`
4. Follow the DNS setup instructions
5. Also add: `www.triplewazachallenge.com`

---

## Step 7: Trigger First Deployment

Click **Create deployment** or push a test change:

```bash
git add .
git commit -m "Test automatic deployment"
git push origin main
```

Cloudflare will automatically:
- Detect the push
- Run `npm run build`
- Deploy to https://triplewazachallenge.com
- Complete in 2-3 minutes

---

## How It Works Going Forward

Every time you make changes:

```bash
# Make your changes to the code
# Then:
git add .
git commit -m "Description of changes"
git push origin main
```

**Cloudflare automatically:**
1. Detects the push to GitHub
2. Builds your site
3. Deploys to production
4. Updates https://triplewazachallenge.com

---

## Monitoring Deployments

1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com)
2. Click on your project
3. View **Deployments** tab to see:
   - Build logs
   - Deployment status
   - Deploy history
   - Preview deployments

---

## Branch Previews (Optional)

Cloudflare automatically creates preview URLs for other branches:

```bash
# Create a new branch for testing
git checkout -b feature/new-feature

# Make changes and push
git push origin feature/new-feature
```

Cloudflare creates a preview URL like:
`https://feature-new-feature.triple-waza-challenge.pages.dev`

---

## Troubleshooting

### Build Fails

1. Check deployment logs in Cloudflare Pages dashboard
2. Verify environment variables are set correctly
3. Test build locally: `npm run build`

### Changes Not Showing

1. Hard refresh browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. Check deployment completed successfully in dashboard
3. Verify you pushed to the correct branch

### GitHub Connection Issues

1. Go to Settings → Builds & deployments
2. Reconnect to GitHub
3. Ensure repository access is granted

---

## Quick Reference Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message"

# Push to trigger deployment
git push origin main

# View remote URL
git remote -v

# Create new branch
git checkout -b branch-name

# Switch branches
git checkout main
```

---

## Success! 🎉

You now have automatic deployments configured. Every push to GitHub automatically updates your live site at https://triplewazachallenge.com.

**Typical deployment time**: 2-3 minutes from push to live.
