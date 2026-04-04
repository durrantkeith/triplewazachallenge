# Cloudflare Pages Deployment Guide

Your project is now set up with two deployment methods for Cloudflare Pages.

## 🚀 Quick Deploy (Manual - 2 minutes)

### Option 1: Using the Deploy Script

1. **Run the deployment script:**
   ```bash
   ./deploy-cloudflare.sh
   ```

2. **First-time setup:**
   - The script will prompt you to login to Cloudflare
   - Follow the authentication flow in your browser
   - Select your Cloudflare account
   - The script will build and deploy automatically

3. **Subsequent deploys:**
   - Just run `./deploy-cloudflare.sh` again
   - It will build and deploy in seconds

---

## 🤖 Automatic Deploy (GitHub Actions)

### One-Time Setup (5 minutes)

#### Step 1: Get Cloudflare Credentials

1. **Get your Cloudflare Account ID:**
   - Go to: https://dash.cloudflare.com
   - Click on any domain
   - Scroll down - you'll see "Account ID" on the right sidebar
   - Copy it (format: `a7c5a18bc39cee73d83dc430b49c60f2`)

2. **Create Cloudflare API Token:**
   - Go to: https://dash.cloudflare.com/profile/api-tokens
   - Click **"Create Token"**
   - Use template: **"Edit Cloudflare Workers"** or create custom with:
     - Permissions: `Cloudflare Pages - Edit`
     - Account Resources: `Include - Your Account`
   - Click **"Continue to summary"** → **"Create Token"**
   - **Copy the token** (you'll only see it once!)

#### Step 2: Add Secrets to GitHub

1. **Go to your GitHub repository:**
   - Navigate to: `Settings` → `Secrets and variables` → `Actions`

2. **Add these secrets** (click "New repository secret" for each):

   | Secret Name | Value | Where to Find |
   |-------------|-------|---------------|
   | `CLOUDFLARE_API_TOKEN` | Your API token | From Step 1 above |
   | `CLOUDFLARE_ACCOUNT_ID` | Your account ID | From Step 1 above |
   | `VITE_SUPABASE_URL` | Your Supabase URL | From your `.env` file |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | From your `.env` file |

#### Step 3: Push to GitHub

```bash
git add .
git commit -m "Add Cloudflare Pages deployment"
git push origin main
```

**That's it!** Every time you push to `main`, your site will automatically deploy.

---

## 📝 Connect Your Custom Domain

### After First Deployment:

1. **Go to Cloudflare Pages:**
   - Visit: https://dash.cloudflare.com/a7c5a18bc39cee73d83dc430b49c60f2/pages
   - Click on your project: `triple-waza-challenge`

2. **Add Custom Domain:**
   - Go to **"Custom domains"** tab
   - Click **"Set up a custom domain"**
   - Enter: `triplewazachallenge.com`
   - Click **"Continue"** and **"Activate domain"**

3. **Your DNS is already configured!**
   - Cloudflare will automatically detect and configure DNS
   - SSL will be provisioned automatically (takes ~1 minute)

4. **Optional - Add www subdomain:**
   - Repeat the process for: `www.triplewazachallenge.com`

---

## ✅ Verification

After deployment, your site will be available at:

- **Production URL:** https://triplewazachallenge.com
- **Preview URL:** https://triple-waza-challenge.pages.dev

---

## 🔄 Future Updates

### Manual Updates:
```bash
./deploy-cloudflare.sh
```

### Automatic Updates:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

The GitHub Action will automatically build and deploy!

---

## 🆘 Troubleshooting

### If deployment fails:

1. **Check Node version:** `node --version` (should be 18+)
2. **Check npm install:** `npm install`
3. **Check build:** `npm run build`
4. **Check Cloudflare auth:** `wrangler whoami`

### If GitHub Action fails:

1. Verify all secrets are added correctly
2. Check the Actions tab for detailed error logs
3. Ensure your repository is public or you have GitHub Actions enabled

---

## 📊 Monitor Deployments

- **GitHub Actions:** https://github.com/YOUR_USERNAME/YOUR_REPO/actions
- **Cloudflare Dashboard:** https://dash.cloudflare.com/a7c5a18bc39cee73d83dc430b49c60f2/pages/view/triple-waza-challenge

---

## 🎉 Benefits

- ✅ **No more 403 errors** - Full control over hosting
- ⚡ **Lightning fast** - Cloudflare's global CDN
- 🔒 **Automatic HTTPS** - SSL certificates managed for you
- 🌍 **Global distribution** - Cached worldwide
- 🆓 **Free hosting** - Unlimited bandwidth on free tier
- 🔄 **Automatic deploys** - Push code, site updates automatically

---

## Need Help?

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages
- **Wrangler CLI Docs:** https://developers.cloudflare.com/workers/wrangler
