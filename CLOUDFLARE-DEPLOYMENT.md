# Deploying Triple Waza Challenge to Cloudflare Pages

This guide will help you deploy your site to https://triplewazachallenge.com using Cloudflare Pages.

## Prerequisites

- Cloudflare account (free tier works)
- Domain `triplewazachallenge.com` added to Cloudflare
- Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Repository

Your project is already configured with:
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 18 or higher

## Step 2: Create Cloudflare Pages Project

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** in the sidebar
3. Click **Create a project**
4. Click **Connect to Git**
5. Select your repository provider and authorize Cloudflare
6. Select the repository for Triple Waza Challenge
7. Configure the build settings:
   - **Project name**: `triple-waza-challenge` (or your preference)
   - **Production branch**: `main` (or your default branch)
   - **Framework preset**: None (or Vite if available)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

## Step 3: Add Environment Variables

In the Cloudflare Pages project settings, add the following environment variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: Get these values from your `.env` file. These are required for the app to connect to your Supabase database.

## Step 4: Deploy

1. Click **Save and Deploy**
2. Cloudflare will build and deploy your site
3. Wait for the build to complete (usually 2-5 minutes)
4. You'll get a temporary `*.pages.dev` URL

## Step 5: Configure Custom Domain

### Option A: Domain Already in Cloudflare (Recommended)

If `triplewazachallenge.com` is already managed by Cloudflare:

1. In your Cloudflare Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter `triplewazachallenge.com`
4. Click **Continue**
5. Cloudflare will automatically configure the DNS records
6. Also add `www.triplewazachallenge.com` and set up a redirect

### Option B: Domain Not in Cloudflare

1. Add your domain to Cloudflare:
   - Go to **Websites** → **Add a site**
   - Enter `triplewazachallenge.com`
   - Choose the Free plan
   - Follow the nameserver change instructions at your domain registrar

2. Once DNS is active, follow Option A above

## Step 6: Configure DNS Records

If not auto-configured, manually add these DNS records in Cloudflare:

**For root domain:**
- Type: `CNAME`
- Name: `@`
- Target: `triple-waza-challenge.pages.dev` (use your actual Pages subdomain)
- Proxy status: Proxied (orange cloud)

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Target: `triple-waza-challenge.pages.dev`
- Proxy status: Proxied (orange cloud)

## Step 7: Enable HTTPS

1. In Cloudflare dashboard, go to **SSL/TLS**
2. Set SSL/TLS encryption mode to **Full** or **Full (strict)**
3. Enable **Always Use HTTPS**
4. Enable **Automatic HTTPS Rewrites**

## Step 8: Configure Redirects (Optional but Recommended)

The `_redirects` file is already set up in your `public` folder for SPA routing.

Additional Cloudflare redirects (if needed):
1. Go to **Pages** → Your project → **Settings** → **Functions**
2. Or use Page Rules for additional redirect logic

## Step 9: Performance Optimization

In Cloudflare Dashboard:

1. **Speed** → **Optimization**
   - Enable Auto Minify (JavaScript, CSS, HTML)
   - Enable Brotli compression

2. **Caching** → **Configuration**
   - Set Browser Cache TTL to "Respect Existing Headers"

## Continuous Deployment

Every time you push to your main branch, Cloudflare Pages will automatically:
1. Detect the changes
2. Run the build
3. Deploy the new version
4. Your site at https://triplewazachallenge.com will update automatically

## Troubleshooting

### Build Fails
- Check build logs in Cloudflare Pages dashboard
- Ensure all environment variables are set correctly
- Verify Node version compatibility

### Site Not Loading
- Check DNS propagation (can take up to 48 hours, usually much faster)
- Verify SSL/TLS settings
- Check browser console for errors

### Environment Variables Not Working
- Ensure variables are prefixed with `VITE_`
- Redeploy after adding new environment variables

### Custom Domain Not Working
- Verify DNS records are correct
- Check that nameservers point to Cloudflare
- Wait for DNS propagation

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Custom Domains Guide](https://developers.cloudflare.com/pages/platform/custom-domains/)
- [Redirects Documentation](https://developers.cloudflare.com/pages/platform/redirects/)

## Support

If you encounter issues:
1. Check Cloudflare Pages deployment logs
2. Review Cloudflare Community forums
3. Check Supabase connection in production
