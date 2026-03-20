# Triple Waza Challenge - Quick Restore Guide

**⚡ Fast restore in 5 minutes**

---

## 🚀 FASTEST RESTORE (GitHub Method)

### If you pushed to GitHub:

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/triple-waza-backup.git
cd triple-waza-backup

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_SUPABASE_URL=https://mhjdzgzyqlvdubmxqvio.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
EOF

# Start development server
npm run dev
```

✅ **Done!** Site running at http://localhost:5173

---

## 📦 LOCAL ZIP RESTORE

### If you have the ZIP backup:

```bash
# Extract
unzip triplewaza-backup-*.zip
cd triplewaza-backup-*/site-files

# Install
npm install

# Configure (create .env with your Supabase credentials)
cp ENV-REFERENCE.txt .env
# Edit .env and add real values

# Run
npm run dev
```

---

## 🗄️ DATABASE RESTORE

### Your database is still running!
**Supabase Project:** https://mhjdzgzyqlvdubmxqvio.supabase.co

The database is **NOT** in this backup. It's running live in Supabase cloud.

**If you need to restore database:**
1. Supabase Dashboard → Database → Backups
2. Click "Restore" on any automatic backup
3. Or run migrations from `/supabase/migrations/` folder

---

## 🔑 CRITICAL INFO YOU NEED

### Supabase Credentials
**URL:** https://mhjdzgzyqlvdubmxqvio.supabase.co
**Anon Key:** Get from Supabase Dashboard → Settings → API

### What's Backed Up
✅ All source code (162 files)
✅ All migrations (88 SQL files)
✅ All components, pages, hooks
✅ All configuration files
✅ All public assets

### What's NOT Backed Up
❌ node_modules (run `npm install`)
❌ .env secrets (reconfigure manually)
❌ Live database data (backed up automatically by Supabase)

---

## 🆘 COMMON ISSUES

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Supabase connection failed"
Check your `.env` file has correct credentials from Supabase Dashboard

### "Database tables missing"
Run migrations:
```bash
# Copy migrations from backup to project
# Then use Supabase CLI or Dashboard SQL editor
```

---

## 📞 NEED HELP?

See `BACKUP-DOCUMENTATION.md` for complete details.
