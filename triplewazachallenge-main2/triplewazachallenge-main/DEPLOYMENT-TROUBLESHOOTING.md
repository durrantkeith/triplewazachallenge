# Deployment Troubleshooting Guide

## Why Your Site Isn't Updating

Your site isn't updating on Netlify or Cloudflare because **you don't have a GitHub repository connected**. Both platforms need to pull your code from GitHub to build and deploy.

---

## Quick Fix: Connect to GitHub

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `triple-waza-challenge`
3. Choose Public or Private
4. **DO NOT** check "Add README"
5. Click **Create repository**

### Step 2: Push Your Code to GitHub

Your code is now committed locally. Push it to GitHub:

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/triple-waza-challenge.git

# Push code to GitHub
git push -u origin main
```

If you're asked for credentials:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your password)
  - Create one at: https://github.com/settings/tokens
  - Select: `repo` scope
  - Copy the token and paste it as password

### Step 3A: Connect Cloudflare Pages to GitHub

1. Go to https://dash.cloudflare.com
2. Click **Pages** in sidebar
3. Find your project or click **Create a project**
4. Click **Connect to Git**
5. Authorize Cloudflare to access GitHub
6. Select `triple-waza-challenge` repository
7. Configure:
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
8. Add Environment Variables:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
9. Click **Save and Deploy**

### Step 3B: Connect Netlify to GitHub

1. Go to https://app.netlify.com
2. Click **Add new site** → **Import an existing project**
3. Click **GitHub**
4. Authorize Netlify to access GitHub
5. Search for `triple-waza-challenge`
6. Select the repository
7. Configure:
   - **Branch**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
8. Click **Advanced build settings** → **New variable**:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
9. Click **Deploy site**

---

## After Setup: How to Update Your Site

Once connected to GitHub, updates are automatic:

```bash
# Make your code changes
# Then commit and push:
git add .
git commit -m "Describe your changes"
git push origin main
```

Both Netlify and Cloudflare will:
1. Detect the push
2. Run `npm run build`
3. Deploy automatically
4. Update your live site in 2-3 minutes

---

## Common Issues

### Issue: "Git push rejected"

**Solution**: Pull first, then push
```bash
git pull origin main --rebase
git push origin main
```

### Issue: "Build failed" on Netlify/Cloudflare

**Check**:
1. Environment variables are set correctly
2. Build works locally: `npm run build`
3. Check build logs in Netlify/Cloudflare dashboard

### Issue: "Changes pushed but site not updating"

**Check**:
1. Did build complete successfully? Check dashboard
2. Clear browser cache: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Check you pushed to the correct branch

### Issue: "Authentication failed when pushing to GitHub"

**Solution**: Use Personal Access Token instead of password
1. Go to https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Select `repo` scope
4. Copy token
5. Use token as password when pushing

### Issue: "Site shows old version"

**Solution**:
1. Hard refresh: Ctrl+Shift+R or Cmd+Shift+R
2. Check deployment completed in dashboard
3. Wait 2-3 minutes for CDN to update

---

## Verify Your Setup

### Check Git Status
```bash
git status
git remote -v
git log --oneline -3
```

### Check GitHub
Go to your repository: `https://github.com/YOUR_USERNAME/triple-waza-challenge`

You should see all your files there.

### Check Deployment Status

**Cloudflare**:
- https://dash.cloudflare.com → Pages → Your Project → Deployments

**Netlify**:
- https://app.netlify.com → Your Site → Deploys

---

## Next Steps After Connection

1. Push code to GitHub (if not done yet)
2. Verify deployment started in Cloudflare/Netlify dashboard
3. Wait 2-3 minutes for build to complete
4. Visit your live site to confirm updates
5. For future updates, just `git push origin main`

---

## Custom Domain Setup

### Cloudflare Pages
1. In your Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `triplewazachallenge.com`
4. Follow DNS instructions
5. Also add: `www.triplewazachallenge.com`

### Netlify
1. In your site → **Domain settings**
2. Click **Add custom domain**
3. Enter: `triplewazachallenge.com`
4. Update DNS records as instructed
5. Enable HTTPS (automatic)

---

## Getting Help

If you're still having issues:

1. Check build logs in your deployment platform
2. Verify environment variables are set
3. Test build locally: `npm run build`
4. Ensure you pushed to GitHub: `git log`
5. Check GitHub repository has latest code

---

## Quick Reference

```bash
# Check what's changed
git status

# Commit changes
git add .
git commit -m "Your message"

# Push to GitHub (triggers deployment)
git push origin main

# View recent commits
git log --oneline -5

# Check remote connection
git remote -v
```

Your site will update automatically 2-3 minutes after each push to GitHub.
