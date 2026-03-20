# Complete Deployment Guide

This guide will help you deploy your Triple Waza Challenge platform to:
1. **https://triple-waza-judo-vid-7qdg.bolt.host** (GitHub Pages)
2. **https://www.triplewazachallenge.com** (Cloudflare Pages with custom domain)

---

## Part 1: Deploy to GitHub Pages (bolt.host)

### Step 1: Enable GitHub Pages

1. Go to your repository: **https://github.com/durrantkeith/triple-waza-judo-vid-7qdg**
2. Click **Settings** → **Pages** (in left sidebar)
3. Under "Source", select:
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
4. Click **Save**

### Step 2: Add GitHub Secrets

Your repository needs access to your Supabase credentials:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:

   **Secret 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: Your Supabase URL from `.env` file

   **Secret 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon key from `.env` file

### Step 3: Create GitHub Actions Workflow for GitHub Pages

I'll create a workflow file that deploys to GitHub Pages.

### Step 4: Configure Custom Domain (bolt.host)

After the first deployment:
1. Go to **Settings** → **Pages**
2. Under "Custom domain", enter: `triple-waza-judo-vid-7qdg.bolt.host`
3. Click **Save**
4. Wait for DNS check to complete

---

## Part 2: Deploy to Cloudflare Pages (triplewazachallenge.com)

### Step 1: Set Up Cloudflare Pages Project

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages** → **Pages**
3. Click **Create a project** → **Connect to Git**
4. Select **GitHub** and authorize Cloudflare
5. Choose repository: `durrantkeith/triple-waza-judo-vid-7qdg`
6. Configure build settings:
   - **Project name**: `triple-waza-challenge`
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

### Step 2: Add Environment Variables in Cloudflare

Before deploying, add these environment variables:

1. In your Cloudflare Pages project, go to **Settings** → **Environment variables**
2. Add the following variables for **Production**:

   ```
   VITE_SUPABASE_URL = your_supabase_url
   VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
   ```

3. Click **Save**

### Step 3: Deploy to Cloudflare

1. Click **Save and Deploy**
2. Cloudflare will build your site (takes 2-5 minutes)
3. You'll get a temporary URL like: `triple-waza-challenge.pages.dev`

### Step 4: Add Custom Domain (triplewazachallenge.com)

#### Option A: Domain Already in Cloudflare

1. In your Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `triplewazachallenge.com`
4. Click **Continue** → Cloudflare will auto-configure DNS
5. Repeat for `www.triplewazachallenge.com`

#### Option B: Domain Not in Cloudflare Yet

1. Go to Cloudflare Dashboard → **Websites** → **Add a site**
2. Enter `triplewazachallenge.com`
3. Choose **Free** plan
4. Follow instructions to change nameservers at your domain registrar to:
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ```
5. Wait for DNS to activate (usually 5-30 minutes)
6. Then follow Option A above

### Step 5: Configure SSL/TLS

1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to: **Full (strict)**
3. Go to **SSL/TLS** → **Edge Certificates**
4. Enable:
   - ✅ Always Use HTTPS
   - ✅ Automatic HTTPS Rewrites
   - ✅ Opportunistic Encryption

---

## Part 3: Set Up GitHub Secrets for Cloudflare (Automated Deployments)

To enable automatic Cloudflare deployments via GitHub Actions:

### Step 1: Get Cloudflare API Token

1. Go to Cloudflare Dashboard → **My Profile** → **API Tokens**
2. Click **Create Token**
3. Use template: **Edit Cloudflare Workers**
4. Or create custom token with permissions:
   - Account → Cloudflare Pages → Edit
5. Copy the token (you'll only see it once!)

### Step 2: Get Cloudflare Account ID

1. In Cloudflare Dashboard, select any website
2. Scroll down on the Overview page
3. Copy your **Account ID** from the right sidebar

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repo: **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

   **Secret 3:**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: The API token from Step 1

   **Secret 4:**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: Your account ID from Step 2

---

## Summary of Deployments

After completing both parts:

✅ **GitHub Pages (bolt.host)**
- URL: https://triple-waza-judo-vid-7qdg.bolt.host
- Auto-deploys when you push to `main` branch
- Uses GitHub Actions workflow

✅ **Cloudflare Pages (Custom Domain)**
- URL: https://www.triplewazachallenge.com
- Auto-deploys when you push to `main` branch
- Uses Cloudflare Pages automatic deployment

Both sites will automatically update when you push changes to GitHub!

---

## Testing Your Deployment

After deployment, verify:

1. ✅ Site loads correctly
2. ✅ All images and assets appear
3. ✅ Navigation works
4. ✅ Video submissions work (Supabase connection)
5. ✅ Forms submit correctly
6. ✅ SSL certificate is active (green padlock in browser)

---

## Troubleshooting

### GitHub Pages Issues

**Site not loading:**
- Check Actions tab for build errors
- Verify secrets are set correctly
- Ensure gh-pages branch exists

**404 errors on routes:**
- Check that `_redirects` file is in `public` folder
- For GitHub Pages, you may need a `404.html` that redirects to `index.html`

### Cloudflare Issues

**Build fails:**
- Check build logs in Cloudflare Pages dashboard
- Verify environment variables are set
- Check Node version compatibility

**Custom domain not working:**
- Verify nameservers point to Cloudflare
- Check DNS records (should be auto-configured)
- Wait for DNS propagation (up to 48 hours, usually faster)

**Environment variables not loading:**
- Ensure they're prefixed with `VITE_`
- Redeploy after adding variables
- Check browser console for connection errors

---

## Next Steps

1. Complete GitHub Pages setup (Part 1)
2. Complete Cloudflare Pages setup (Part 2)
3. Test both deployments
4. Set up monitoring and analytics (optional)
5. Configure email notifications for deployment status

---

## Support Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Supabase Documentation](https://supabase.com/docs)
