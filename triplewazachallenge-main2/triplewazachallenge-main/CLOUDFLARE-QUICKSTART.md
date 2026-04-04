# Quick Start: Deploy to triplewazachallenge.com

## 5-Minute Setup Checklist

### ✅ Step 1: Push to Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### ✅ Step 2: Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages**
2. Click **Create a project** → **Connect to Git**
3. Select your repository
4. Configure build:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: (leave empty)

### ✅ Step 3: Add Environment Variables

In Cloudflare Pages project settings, add:

```
VITE_SUPABASE_URL=<from your .env file>
VITE_SUPABASE_ANON_KEY=<from your .env file>
```

### ✅ Step 4: Deploy
Click **Save and Deploy** and wait ~3 minutes

### ✅ Step 5: Add Custom Domain

1. In your Pages project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `triplewazachallenge.com`
4. If your domain is already in Cloudflare, it will auto-configure DNS
5. Add `www.triplewazachallenge.com` as well

### ✅ Step 6: Enable SSL

1. Go to **SSL/TLS** tab
2. Set encryption mode to **Full**
3. Enable **Always Use HTTPS**

## Done! 🎉

Your site will be live at https://triplewazachallenge.com in a few minutes.

DNS propagation may take up to 48 hours, but typically completes in 5-10 minutes.

---

## Need Help?

- Full guide: See `CLOUDFLARE-DEPLOYMENT.md`
- DNS issues: Check nameservers point to Cloudflare
- Build fails: Check deployment logs in Cloudflare Pages dashboard
