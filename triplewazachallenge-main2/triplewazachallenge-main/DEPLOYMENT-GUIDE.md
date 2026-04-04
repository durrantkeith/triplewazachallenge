# Deployment Guide - Triple Waza Friendship Challenge

This guide covers deploying your application to GitHub Pages and Netlify.

---

## Prerequisites

Before deploying, ensure you have:
- Your code uploaded to GitHub
- Supabase project URL and anon key (from your `.env` file)
- Node.js installed locally (for testing builds)

---

## Option 1: Deploy to Netlify (Recommended)

Netlify offers the easiest deployment with automatic HTTPS, custom domains, and continuous deployment.

### Step 1: Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up with your GitHub account

### Step 2: Deploy from GitHub
1. Click **"Add new site"** → **"Import an existing project"**
2. Select **GitHub** as your provider
3. Authorize Netlify to access your repositories
4. Choose your `triple-waza-friendship-challenge` repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Base directory:** (leave empty)

### Step 3: Add Environment Variables
1. In Netlify, go to **Site settings** → **Environment variables**
2. Add these variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   (Copy values from your `.env` file)

### Step 4: Deploy
1. Click **"Deploy site"**
2. Wait 2-3 minutes for build to complete
3. Your site will be live at: `https://random-name-12345.netlify.app`

### Step 5: Custom Domain (Optional)
1. Go to **Domain settings** → **Add custom domain**
2. Follow instructions to:
   - Add your domain (e.g., `triplewaza.com`)
   - Update DNS settings with your domain provider
   - Enable HTTPS (automatic)

### Step 6: Configure Redirects
Your project already includes a `dist/_redirects` file for SPA routing.
Netlify will automatically use it.

---

## Option 2: Deploy to GitHub Pages

GitHub Pages is free but requires a few extra steps for React apps.

### Step 1: Update vite.config.ts
Add the base path for GitHub Pages:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/triple-waza-friendship-challenge/', // Add this line
  server: {
    port: 5173,
    open: true
  }
});
```

### Step 2: Install gh-pages Package
In your local project directory:
```bash
npm install --save-dev gh-pages
```

### Step 3: Update package.json
Add these scripts to your `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 4: Build and Deploy
Run this command from your project directory:
```bash
npm run deploy
```

### Step 5: Configure GitHub Pages
1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **Save**

### Step 6: Add Environment Variables (GitHub Actions)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      run: npm run build

    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

Then add secrets in GitHub:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add **New repository secret**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Step 7: Access Your Site
Your site will be live at:
```
https://durrantkeith.github.io/triple-waza-friendship-challenge/
```

---

## Comparison: Netlify vs GitHub Pages

| Feature | Netlify | GitHub Pages |
|---------|---------|--------------|
| Setup Difficulty | ⭐ Easy | ⭐⭐ Moderate |
| Build Time | 2-3 min | 3-5 min |
| Custom Domain | Free HTTPS | Free, manual HTTPS |
| Environment Variables | Native support | Requires GitHub Actions |
| Redirects/Rewrites | Native support | Manual configuration |
| Deploy Previews | Yes (for PRs) | No |
| Analytics | Built-in | Requires Google Analytics |
| **Recommendation** | ✅ Best for production | Good for personal projects |

---

## Post-Deployment Checklist

After deploying to either platform:

### 1. Test Core Features
- [ ] Homepage loads correctly
- [ ] Navigation works on all pages
- [ ] Forms submit successfully
- [ ] Images and assets load
- [ ] Database queries work (check browser console)

### 2. Update Supabase Settings
Add your deployment URL to Supabase:
1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Add your site URL to **Redirect URLs**:
   - Netlify: `https://your-site.netlify.app/*`
   - GitHub Pages: `https://durrantkeith.github.io/triple-waza-friendship-challenge/*`

### 3. Test Email Function
The Edge Function for challenge emails should work automatically.
Test by submitting a challenge on your live site.

### 4. Monitor Performance
- Check browser console for errors
- Test on mobile devices
- Verify all external links work
- Test form submissions

---

## Troubleshooting

### "Page Not Found" on Refresh (Netlify)
**Solution:** Already handled by `_redirects` file in your project.

### "Page Not Found" on Refresh (GitHub Pages)
**Solution:** Use the 404.html trick or switch to hash routing.

### Environment Variables Not Working
**Solution:**
- Netlify: Check Site Settings → Environment Variables
- GitHub Pages: Check Actions secrets are set correctly
- Rebuild/redeploy after adding variables

### Images Not Loading
**Solution:**
- Check image paths in `public/` folder
- Verify base path in `vite.config.ts` for GitHub Pages
- Use relative paths, not absolute

### Database Queries Failing
**Solution:**
- Open browser DevTools → Console
- Check for CORS errors
- Verify environment variables are set
- Check Supabase project is active

---

## Continuous Deployment

Once set up, both platforms support automatic deployment:

### Netlify
- Automatically rebuilds on every push to `main`
- Deploy previews for pull requests
- Rollback to previous deployments

### GitHub Pages (with Actions)
- Automatically rebuilds on push to `main`
- View build logs in Actions tab
- Manual rollback via git

---

## Custom Domain Setup

### For Netlify:
1. Go to **Domain settings** → **Add custom domain**
2. Add your domain (e.g., `triplewaza.com`)
3. Add DNS records at your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```
4. Enable HTTPS (automatic)

### For GitHub Pages:
1. Go to **Settings** → **Pages**
2. Enter custom domain
3. Add DNS records at your domain provider:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   ```
4. Wait for HTTPS certificate (24-48 hours)

---

## Performance Optimization

After deployment, consider:

1. **Enable Caching**
   - Netlify does this automatically
   - GitHub Pages has default caching

2. **Optimize Images**
   - Compress images before uploading
   - Use WebP format when possible

3. **Monitor Bundle Size**
   ```bash
   npm run build
   # Check dist/ folder size
   ```

4. **Add Analytics**
   - Netlify Analytics (paid)
   - Google Analytics (free)
   - Plausible Analytics (privacy-focused)

---

## Getting Help

- **Netlify Docs:** https://docs.netlify.com
- **GitHub Pages Docs:** https://docs.github.com/pages
- **Supabase Docs:** https://supabase.com/docs
- **Vite Docs:** https://vitejs.dev

---

## Quick Commands Reference

### Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Deployment
```bash
# Netlify (via website)
# Just push to GitHub, Netlify auto-deploys

# GitHub Pages
npm run deploy       # Build and deploy

# Manual build
npm run build        # Creates dist/ folder
```

---

## Data Backup Reminder

Your Supabase database contains all user data. The code is separate from the data.

- **Code:** Lives in GitHub
- **Data:** Lives in Supabase
- **Deployments:** Netlify/GitHub Pages (just serve the code)

To backup your data, use the `create-backup.sh` script included in your project.

---

**You're ready to deploy!** Choose Netlify for the easiest experience, or GitHub Pages if you prefer keeping everything on GitHub.
