# Publishing Triple Waza Challenge to www.triplewazachallenge.com

## What You Need Before Starting
- [ ] A GitHub account (free at github.com)
- [ ] A Netlify account (free at netlify.com)
- [ ] Access to your Cloudflare account (where you manage triplewazachallenge.com)
- [ ] This project downloaded to your computer

---

## Step 1: Put Your Code on GitHub (5 minutes)

### Why?
GitHub stores your code and connects to Netlify for automatic updates.

### How:

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it: `triple-waza-challenge`
   - Keep it Public or Private (your choice)
   - Click "Create repository"
   - **Don't close this page** - you'll need the commands it shows

2. **Upload your code to GitHub:**
   - Open Terminal (Mac) or Command Prompt (Windows)
   - Navigate to your project folder:
     ```bash
     cd /path/to/your/project
     ```
   - Run these commands (GitHub will show you these):
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/YOUR-USERNAME/triple-waza-challenge.git
     git push -u origin main
     ```

✅ **You're done when:** You can see all your files on GitHub

---

## Step 2: Deploy to Netlify (10 minutes)

### Why?
Netlify hosts your website and makes it available online.

### How:

1. **Sign up/Login to Netlify:**
   - Go to https://app.netlify.com
   - Click "Sign up with GitHub" (easiest option)

2. **Import your project:**
   - Click the big green button: **"Add new site"**
   - Choose **"Import an existing project"**
   - Click **"GitHub"**
   - Find and click your repository: `triple-waza-challenge`

3. **Configure build settings:**
   ```
   Build command: npm run build
   Publish directory: dist
   ```
   - Click **"Show advanced"** → **"New variable"**

4. **Add your Supabase secrets:**
   - Open your `.env` file from the project
   - Copy the values and add them as environment variables:

   ```
   Variable name: VITE_SUPABASE_URL
   Value: [paste from .env file]

   Variable name: VITE_SUPABASE_ANON_KEY
   Value: [paste from .env file]
   ```

5. **Click "Deploy site"**

6. **Wait 2-3 minutes** - Netlify will build your site

✅ **You're done when:** You see "Published" with a green checkmark and a temporary URL like `random-name-123.netlify.app`

---

## Step 3: Connect Your Custom Domain (5 minutes)

### Why?
This changes the URL from `random-name-123.netlify.app` to `www.triplewazachallenge.com`

### How:

1. **In Netlify (stay on your site's page):**
   - Click **"Domain settings"** in the left menu
   - Click **"Add a domain"** or **"Add custom domain"**
   - Type: `triplewazachallenge.com`
   - Click **"Verify"** then **"Add domain"**
   - Click **"Add domain"** again and add: `www.triplewazachallenge.com`

2. **Netlify will show DNS instructions** - keep this page open!

✅ **You're done when:** Both domains show in your Netlify domain list

---

## Step 4: Update Cloudflare DNS (10 minutes)

### Why?
This tells the internet that triplewazachallenge.com should point to your Netlify site.

### How:

1. **Login to Cloudflare:**
   - Go to https://dash.cloudflare.com
   - Click on **triplewazachallenge.com**

2. **Go to DNS settings:**
   - Click **"DNS"** in the left menu

3. **Delete old records (if any exist):**
   - Look for records pointing to triplewazachallenge.com or www
   - Click "Edit" then "Delete" on any A, AAAA, or CNAME records for these

4. **Add new records:**

   **First record (for www):**
   ```
   Type: CNAME
   Name: www
   Target: [your-netlify-site].netlify.app
   Proxy status: Proxied (orange cloud)
   TTL: Auto
   ```

   **Second record (for root domain):**
   ```
   Type: CNAME
   Name: @
   Target: [your-netlify-site].netlify.app
   Proxy status: Proxied (orange cloud)
   TTL: Auto
   ```

   **To find your Netlify site name:**
   - In Netlify, look at the top - you'll see something like `brave-curie-123abc.netlify.app`
   - Use this full name as the Target

5. **Click "Save"** for each record

✅ **You're done when:** You see both CNAME records listed with orange cloud icons

---

## Step 5: Configure SSL (2 minutes)

### Why?
This makes your site secure with HTTPS (the padlock in the browser).

### How:

1. **In Cloudflare:**
   - Click **"SSL/TLS"** in the left menu
   - Select **"Full"** or **"Full (strict)"**
   - Click **"Save"**

2. **In Netlify:**
   - Go back to your site → **"Domain settings"**
   - Scroll to **"HTTPS"**
   - Click **"Verify DNS configuration"**
   - Wait a few minutes
   - Netlify will automatically provision SSL certificate

✅ **You're done when:** You see a green checkmark next to "HTTPS" in Netlify

---

## Step 6: Wait and Test (30 minutes - 24 hours)

### Why?
DNS changes take time to spread across the internet.

### How:

1. **Wait 30 minutes to 24 hours** (usually works within 1-2 hours)

2. **Test your site:**
   - Open a browser
   - Go to: `https://www.triplewazachallenge.com`
   - Go to: `https://triplewazachallenge.com`
   - Both should load your site!

3. **Check SSL:**
   - Look for the padlock 🔒 in the browser address bar
   - Click it - should say "Connection is secure"

✅ **You're done when:** Your site loads with HTTPS and shows your Triple Waza Challenge content!

---

## Troubleshooting Common Issues

### "Site not found" or "Page not loading"
- **Wait longer** - DNS can take up to 48 hours
- Check your Cloudflare DNS records are correct
- Make sure the Netlify site name matches exactly

### "Not secure" warning
- Wait for SSL certificate to provision (can take 30 minutes)
- Check Cloudflare SSL/TLS is set to "Full"
- Verify DNS is using Cloudflare nameservers

### Build failed on Netlify
- Check you added both environment variables
- Make sure build command is exactly: `npm run build`
- Check publish directory is exactly: `dist`

### Site loads but looks broken
- Check browser console for errors (F12 key)
- Verify environment variables in Netlify match your `.env` file
- Make sure Supabase URL and keys are correct

---

## Future Updates

When you want to update your site:

1. Make changes to your code locally
2. Run these commands:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. Netlify automatically rebuilds and deploys (takes 2-3 minutes)
4. Refresh your browser!

---

## Need Help?

- **Netlify docs:** https://docs.netlify.com
- **Cloudflare docs:** https://developers.cloudflare.com
- **Check build logs:** In Netlify → "Deploys" → Click on latest deploy → "Deploy log"

---

**You've got this! Follow each step carefully and you'll have your site live soon! 🥋**
