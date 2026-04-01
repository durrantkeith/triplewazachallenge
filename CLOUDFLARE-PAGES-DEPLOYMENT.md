# Deploy Triple Waza Challenge to Cloudflare Pages

This guide will walk you through deploying your Triple Waza Challenge project to Cloudflare Pages with your custom domain.

## Prerequisites

- A Cloudflare account (you already have one!)
- Your project files downloaded from Bolt
- Git installed on your computer
- A GitHub account (recommended) or use Direct Upload

## Method 1: Deploy via GitHub (Recommended)

This method enables automatic deployments when you push changes.

### Step 1: Download Your Project from Bolt

1. In Bolt, click the **Download** button or use the export feature
2. Extract the downloaded ZIP file to a folder on your computer

### Step 2: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon in the top right, then **New repository**
3. Name it: `triple-waza-challenge`
4. Keep it **Public** or **Private** (your choice)
5. **Do not** initialize with README, .gitignore, or license
6. Click **Create repository**

### Step 3: Push Your Code to GitHub

Open a terminal/command prompt in your project folder and run:

```bash
git init
git add .
git commit -m "Initial commit - Triple Waza Challenge"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/triple-waza-challenge.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 4: Connect to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Workers & Pages** in the left sidebar
3. Click **Create application**
4. Select the **Pages** tab
5. Click **Connect to Git**
6. Authorize Cloudflare to access your GitHub account
7. Select your `triple-waza-challenge` repository
8. Click **Begin setup**

### Step 5: Configure Build Settings

On the setup page, configure:

- **Project name**: `triple-waza-challenge` (or your preferred name)
- **Production branch**: `main`
- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`

### Step 6: Add Environment Variables

Click **Add environment variable** and add:

1. **Variable name**: `VITE_SUPABASE_URL`
   **Value**: `https://mhjdzgzyqlvdubmxqvio.supabase.co`

2. **Variable name**: `VITE_SUPABASE_ANON_KEY`
   **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oamR6Z3p5cWx2ZHVibXhxdmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDUwNTQsImV4cCI6MjA4MDc4MTA1NH0.V_8FyZ_L3blv_sYNudvQsmrAm8S4ccUMNyJoMAZ-J8w`

### Step 7: Deploy

1. Click **Save and Deploy**
2. Cloudflare will build and deploy your site (takes 2-5 minutes)
3. You'll get a URL like: `https://triple-waza-challenge.pages.dev`

### Step 8: Add Custom Domain

1. Once deployed, go to your project in Cloudflare Pages
2. Click the **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter: `www.triplewazachallenge.com`
5. Click **Continue**
6. Cloudflare will automatically detect that you're using Cloudflare DNS
7. Click **Activate domain**
8. SSL certificate will be issued automatically (takes a few minutes)

### Step 9: Add Root Domain (Optional but Recommended)

1. Click **Set up a custom domain** again
2. Enter: `triplewazachallenge.com`
3. Click **Continue** and **Activate domain**
4. This will redirect to www automatically

### Step 10: Configure DNS in Cloudflare

Cloudflare Pages should auto-configure your DNS, but verify:

1. Go to **DNS** → **Records** in Cloudflare
2. You should see:
   - `CNAME` record for `www` pointing to `triple-waza-challenge.pages.dev`
   - `CNAME` record for `@` pointing to `triple-waza-challenge.pages.dev`
3. Both should have **Proxied** status (orange cloud enabled)

---

## Method 2: Direct Upload (No Git Required)

If you prefer not to use GitHub:

### Step 1: Download and Build Locally

1. Download your project from Bolt
2. Extract the files
3. Open a terminal in the project folder
4. Run:
   ```bash
   npm install
   npm run build
   ```
5. This creates a `dist` folder with your built site

### Step 2: Upload to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Workers & Pages**
3. Click **Create application**
4. Select the **Pages** tab
5. Click **Upload assets**
6. Name your project: `triple-waza-challenge`
7. Drag the `dist` folder (or select it) to upload
8. Click **Deploy site**

### Step 3: Configure Environment Variables

**Important**: With Direct Upload, environment variables must be set BEFORE building locally.

1. Create a `.env.production` file in your project with:
   ```
   VITE_SUPABASE_URL=https://mhjdzgzyqlvdubmxqvio.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oamR6Z3p5cWx2ZHVibXhxdmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDUwNTQsImV4cCI6MjA4MDc4MTA1NH0.V_8FyZ_L3blv_sYNudvQsmrAm8S4ccUMNyJoMAZ-J8w
   ```
2. Rebuild: `npm run build`
3. Re-upload the new `dist` folder

### Step 4: Add Custom Domain

Follow **Step 8 and Step 9** from Method 1 above.

---

## Verify Deployment

1. Visit `https://www.triplewazachallenge.com`
2. Verify the site loads correctly
3. Test features that use Supabase (submissions, testimonials, etc.)
4. Check that SSL certificate is active (padlock icon in browser)

## Troubleshooting

### Site not loading
- Wait 5-10 minutes for DNS propagation
- Clear your browser cache
- Try incognito/private browsing mode

### Database features not working
- Verify environment variables are set correctly
- Check browser console for errors
- Verify Supabase URL and anon key are correct

### SSL Certificate Issues
- Wait up to 24 hours for SSL provisioning
- Ensure Cloudflare proxy is enabled (orange cloud)

## Future Updates

### With GitHub (Method 1)
Simply push changes to your repository:
```bash
git add .
git commit -m "Your update message"
git push
```
Cloudflare automatically rebuilds and deploys.

### With Direct Upload (Method 2)
1. Make changes locally
2. Run `npm run build`
3. Upload new `dist` folder to Cloudflare Pages

---

## Additional Configuration

### Enable Analytics
1. Go to your project in Cloudflare Pages
2. Click **Analytics** tab
3. Enable Web Analytics for visitor insights

### Set Up Redirects
Create a `_redirects` file in your `public` folder:
```
/old-path /new-path 301
```

### Headers Configuration
Create a `_headers` file in your `public` folder for custom HTTP headers.

---

## Support

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Cloudflare Community**: https://community.cloudflare.com/
- **Your Supabase Project**: https://supabase.com/dashboard/project/mhjdzgzyqlvdubmxqvio

---

Your Triple Waza Challenge site will be live at:
- https://www.triplewazachallenge.com
- https://triplewazachallenge.com (redirects to www)
- https://triple-waza-challenge.pages.dev (Cloudflare default URL)
