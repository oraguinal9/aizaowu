#!/bin/bash
# AI造物 部署脚本（香港服务器）
set -e
echo "🔨 Building AI造物..."
cd /e/aizaowu && npx next build

echo "📦 Packaging standalone..."
tar czf /tmp/aizaowu-standalone.tar.gz .next/standalone .next/static public

echo "📤 Uploading to HK server..."
scp -i ~/.ssh/evoxt /tmp/aizaowu-standalone.tar.gz root@23.26.201.180:/tmp/

echo "🚀 Deploying..."
ssh -i ~/.ssh/evoxt root@23.26.201.180 "\
  cd /var/www/aizaowu && \
  tar xzf /tmp/aizaowu-standalone.tar.gz && \
  pm2 restart aizaowu\
"

echo "✅ Deployed! https://aizaow.com"
