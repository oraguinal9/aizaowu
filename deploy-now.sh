#!/bin/bash
cd /e/aizaowu
npx next build 2>&1 | tail -1
scp -i ~/.ssh/evoxt -r .next root@114.55.148.70:/var/www/aizaowu/
ssh -i ~/.ssh/evoxt root@114.55.148.70 "pm2 restart aizaowu"
echo "deployed"
