#!/bin/bash

# Triple Waza Challenge - Automated Backup Script
# Run this script to create a complete downloadable backup

set -e  # Exit on any error

# Configuration
BACKUP_DATE=$(date +%Y-%m-%d-%H%M%S)
BACKUP_NAME="triplewaza-backup-$BACKUP_DATE"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔄 Creating backup: $BACKUP_NAME"
echo "📁 Project directory: $PROJECT_DIR"
echo ""

# Create backup directory structure
mkdir -p "$BACKUP_NAME"/{site-files,database,public-assets,documentation}

echo "✅ Created backup directory structure"

# Copy source files
echo "📦 Copying source files..."
cp -r "$PROJECT_DIR/src" "$BACKUP_NAME/site-files/"
cp -r "$PROJECT_DIR/public" "$BACKUP_NAME/public-assets/"
cp "$PROJECT_DIR/package.json" "$BACKUP_NAME/site-files/"
cp "$PROJECT_DIR/package-lock.json" "$BACKUP_NAME/site-files/"
cp "$PROJECT_DIR/index.html" "$BACKUP_NAME/site-files/"
cp "$PROJECT_DIR/.gitignore" "$BACKUP_NAME/site-files/" 2>/dev/null || true

echo "✅ Copied source files"

# Copy configuration files
echo "⚙️  Copying configuration files..."
cp "$PROJECT_DIR"/*.config.js "$BACKUP_NAME/site-files/" 2>/dev/null || true
cp "$PROJECT_DIR"/*.config.ts "$BACKUP_NAME/site-files/" 2>/dev/null || true
cp "$PROJECT_DIR"/tsconfig*.json "$BACKUP_NAME/site-files/" 2>/dev/null || true
cp "$PROJECT_DIR"/.env.example "$BACKUP_NAME/site-files/" 2>/dev/null || true

echo "✅ Copied configuration files"

# Copy database migrations
echo "🗄️  Copying database migrations..."
cp -r "$PROJECT_DIR/supabase" "$BACKUP_NAME/database/"

echo "✅ Copied database migrations"

# Copy documentation
echo "📚 Copying documentation..."
cp "$PROJECT_DIR"/*.md "$BACKUP_NAME/documentation/" 2>/dev/null || true

echo "✅ Copied documentation"

# Create environment reference
echo "🔑 Creating environment reference..."
cat > "$BACKUP_NAME/ENV-REFERENCE.txt" << 'EOF'
# Triple Waza Challenge - Environment Variables Reference
# DO NOT include actual secret values in backups
# Reconfigure these after restore

# Required Environment Variables:
# ================================

VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# How to get these values:
# 1. Go to https://supabase.com/dashboard
# 2. Select your project
# 3. Go to Settings → API
# 4. Copy "Project URL" and "anon public" key
EOF

echo "✅ Created environment reference"

# Create file manifest
echo "📋 Creating file manifest..."
cat > "$BACKUP_NAME/FILE-MANIFEST.txt" << EOF
Triple Waza Challenge - File Manifest
Generated: $BACKUP_DATE

BACKUP CONTENTS:
================

Source Files:
$(find "$BACKUP_NAME/site-files" -type f | wc -l) files

Public Assets:
$(find "$BACKUP_NAME/public-assets" -type f | wc -l) files

Database Migrations:
$(find "$BACKUP_NAME/database" -type f -name "*.sql" | wc -l) SQL files

Documentation:
$(find "$BACKUP_NAME/documentation" -type f | wc -l) files

TOTAL SIZE:
$(du -sh "$BACKUP_NAME" | cut -f1)

FILE LISTING:
=============

EOF

find "$BACKUP_NAME" -type f -exec echo {} \; >> "$BACKUP_NAME/FILE-MANIFEST.txt"

echo "✅ Created file manifest"

# Create checksums
echo "🔒 Creating checksums..."
cd "$BACKUP_NAME"
find . -type f -exec sha256sum {} \; > CHECKSUMS.txt
cd ..

echo "✅ Created checksums"

# Create README for backup
cat > "$BACKUP_NAME/README.txt" << EOF
TRIPLE WAZA CHALLENGE - BACKUP PACKAGE
=======================================

Created: $BACKUP_DATE
Project: www.triplewazachallenge.com

QUICK RESTORE:
==============

1. Extract this backup package
2. Navigate to site-files/ directory
3. Run: npm install
4. Create .env file (see ENV-REFERENCE.txt)
5. Run: npm run dev

FULL INSTRUCTIONS:
==================

See documentation/BACKUP-DOCUMENTATION.md for complete restore guide
See documentation/RESTORE-QUICK-START.md for quick start

VERIFY INTEGRITY:
=================

To verify backup integrity:
  sha256sum -c CHECKSUMS.txt

CONTENTS:
=========

/site-files/          - All source code and configuration
/public-assets/       - Images, icons, media files
/database/            - Database migrations and schema
/documentation/       - All project documentation
ENV-REFERENCE.txt     - Environment variables template
FILE-MANIFEST.txt     - Complete list of all files
CHECKSUMS.txt         - SHA256 checksums for verification

IMPORTANT:
==========

⚠️  This backup does NOT include:
    - node_modules (reinstall with npm install)
    - .env secrets (reconfigure manually)
    - Live database data (backed up by Supabase automatically)

✅  This backup DOES include:
    - All source code
    - All database migrations
    - All configuration files
    - All public assets
    - Complete documentation

SUPPORT:
========

For issues during restore, see:
documentation/BACKUP-DOCUMENTATION.md - Section "EMERGENCY RESTORE SCENARIOS"

EOF

echo "✅ Created README"

# Create ZIP archive
echo "📦 Creating ZIP archive..."
zip -r "$BACKUP_NAME.zip" "$BACKUP_NAME" -q

echo "✅ Created ZIP archive"

# Calculate final size
BACKUP_SIZE=$(du -sh "$BACKUP_NAME.zip" | cut -f1)

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ BACKUP COMPLETED SUCCESSFULLY!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 Backup file: $BACKUP_NAME.zip"
echo "💾 Size: $BACKUP_SIZE"
echo "📅 Date: $BACKUP_DATE"
echo ""
echo "Contents:"
echo "  - $(find "$BACKUP_NAME/site-files" -type f | wc -l) source files"
echo "  - $(find "$BACKUP_NAME/database" -type f -name "*.sql" | wc -l) database migrations"
echo "  - $(find "$BACKUP_NAME/public-assets" -type f | wc -l) public assets"
echo "  - $(find "$BACKUP_NAME/documentation" -type f | wc -l) documentation files"
echo ""
echo "Next steps:"
echo "  1. Download: $BACKUP_NAME.zip"
echo "  2. Store securely (external drive, cloud storage, etc.)"
echo "  3. Test restore on another machine"
echo "  4. Consider pushing to GitHub for version control"
echo ""
echo "To verify integrity:"
echo "  unzip $BACKUP_NAME.zip"
echo "  cd $BACKUP_NAME"
echo "  sha256sum -c CHECKSUMS.txt"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Cleanup option
echo ""
read -p "Delete temporary directory? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$BACKUP_NAME"
    echo "✅ Cleaned up temporary directory"
else
    echo "📁 Temporary directory kept: $BACKUP_NAME"
fi

echo ""
echo "🎉 Backup complete!"
