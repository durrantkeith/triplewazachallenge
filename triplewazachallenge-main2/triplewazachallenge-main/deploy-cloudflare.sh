#!/bin/bash

# Cloudflare Pages Deployment Script
# This script builds and deploys your project to Cloudflare Pages

set -e  # Exit on any error

echo "🚀 Starting Cloudflare Pages Deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI not found!${NC}"
    echo ""
    echo "Installing Wrangler globally..."
    npm install -g wrangler
    echo ""
fi

# Step 1: Build the project
echo -e "${BLUE}📦 Step 1: Building project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"
echo ""

# Step 2: Deploy to Cloudflare Pages
echo -e "${BLUE}🌐 Step 2: Deploying to Cloudflare Pages...${NC}"
echo ""
echo "Note: On first run, you'll need to:"
echo "  1. Authenticate with Cloudflare"
echo "  2. Select your account"
echo "  3. Choose or create a project name"
echo ""

# Deploy using wrangler
wrangler pages deploy dist --project-name=triple-waza-challenge

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo "1. Go to: https://dash.cloudflare.com"
echo "2. Navigate to: Pages > triple-waza-challenge > Custom domains"
echo "3. Add your custom domain: triplewazachallenge.com"
echo "4. Update your DNS CNAME record to point to: triple-waza-challenge.pages.dev"
echo ""
echo -e "${GREEN}🎉 Done!${NC}"
