# Quick Deployment Checklist

## ✅ GitHub Pages Setup (triple-waza-judo-vid-7qdg.bolt.host)

### 1. Add GitHub Secrets
Go to: https://github.com/durrantkeith/triple-waza-judo-vid-7qdg/settings/secrets/actions

Add these secrets:
- [ ] `VITE_SUPABASE_URL` (from your .env file)
- [ ] `VITE_SUPABASE_ANON_KEY` (from your .env file)

### 2. Enable GitHub Pages
Go to: https://github.com/durrantkeith/triple-waza-judo-vid-7qdg/settings/pages

Configure:
- [ ] Source: **GitHub Actions** (select this option)
- [ ] Save settings

### 3. Trigger Deployment
- [ ] Go to Actions tab
- [ ] Click on "Deploy to GitHub Pages" workflow
- [ ] Click "Run workflow" → "Run workflow"
- [ ] Wait for deployment to complete (green checkmark)

### 4. Set Custom Domain (Optional)
After successful deployment:
- [ ] Go to Settings → Pages
- [ ] Enter custom domain: `triple-waza-judo-vid-7qdg.bolt.host`
- [ ] Save

**Your site will be live at:** https://triple-waza-judo-vid-7qdg.bolt.host

---

## ✅ Cloudflare Pages Setup (www.triplewazachallenge.com)

### 1. Create Cloudflare Pages Project
Go to: https://dash.cloudflare.com

- [ ] Navigate to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
- [ ] Select GitHub and authorize
- [ ] Choose repository: `durrantkeith/triple-waza-judo-vid-7qdg`
- [ ] Configure:
  - Project name: `triple-waza-challenge`
  - Production branch: `main`
  - Build command: `npm run build`
  - Build output directory: `dist`

### 2. Add Environment Variables
In Cloudflare Pages project settings:
- [ ] Go to **Settings** → **Environment variables**
- [ ] Add for **Production**:
  - `VITE_SUPABASE_URL` = (from your .env file)
  - `VITE_SUPABASE_ANON_KEY` = (from your .env file)

### 3. Deploy
- [ ] Click **Save and Deploy**
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Note your temporary URL: `triple-waza-challenge.pages.dev`

### 4. Add Custom Domain

#### If triplewazachallenge.com is already in Cloudflare:
- [ ] Go to your Pages project → **Custom domains**
- [ ] Click **Set up a custom domain**
- [ ] Enter: `www.triplewazachallenge.com`
- [ ] Click Continue (DNS auto-configures)
- [ ] Repeat for `triplewazachallenge.com` (apex domain)

#### If domain is NOT in Cloudflare:
- [ ] Add site to Cloudflare (Websites → Add a site)
- [ ] Update nameservers at your registrar to Cloudflare's
- [ ] Wait for activation (5-30 minutes)
- [ ] Then follow steps above

### 5. Configure SSL/TLS
- [ ] Go to **SSL/TLS** → **Overview**
- [ ] Set to: **Full (strict)**
- [ ] Enable **Always Use HTTPS**
- [ ] Enable **Automatic HTTPS Rewrites**

**Your site will be live at:** https://www.triplewazachallenge.com

---

## ✅ Optional: Automated Cloudflare Deployments via GitHub

### 1. Get Cloudflare API Token
- [ ] Cloudflare Dashboard → **My Profile** → **API Tokens**
- [ ] Create token with "Edit Cloudflare Workers" template
- [ ] Copy the token

### 2. Get Cloudflare Account ID
- [ ] Find on any Cloudflare website overview page
- [ ] Copy Account ID from right sidebar

### 3. Add to GitHub Secrets
- [ ] Go to GitHub repo settings → Secrets → Actions
- [ ] Add `CLOUDFLARE_API_TOKEN`
- [ ] Add `CLOUDFLARE_ACCOUNT_ID`

---

## 🎉 Post-Deployment Testing

### Test Both Sites:
- [ ] Site loads correctly
- [ ] All images display
- [ ] Navigation works
- [ ] Video submission form works
- [ ] Supabase connection works
- [ ] SSL certificate active (green padlock)
- [ ] Mobile responsive
- [ ] All routes work (no 404s)

---

## 🚀 Automatic Deployments

Once set up, both sites will automatically deploy when you:
1. Push code to the `main` branch on GitHub
2. GitHub Actions will deploy to GitHub Pages
3. Cloudflare will detect changes and deploy to Cloudflare Pages

**Both sites stay in sync automatically!**

---

## 📞 Need Help?

Refer to: **DEPLOYMENT-SETUP-GUIDE.md** for detailed instructions

Common issues:
- Build failures → Check environment variables
- 404 errors → Check routing configuration
- Blank page → Check browser console for errors
- Domain not working → Check DNS propagation
