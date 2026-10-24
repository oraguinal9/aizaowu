#!/bin/bash
# 片荒盲盒入墙部署：铁律流程 + cp public 必须在 pm2 restart 之前（standalone 启动时扫描 public）
set -e
cd /var/www/aizaowu

echo "== 备份并摘除 mem-guard cron =="
crontab -l > /tmp/cron.bak.watch 2>/dev/null || true
crontab -l 2>/dev/null | grep -v mem-guard > /tmp/cron.new || true
crontab /tmp/cron.new
echo "== pm2 stop all =="
pm2 stop all

echo "== build =="
START=$(date +%s)
if npm run build > /tmp/build_watch.log 2>&1; then
  echo BUILD_OK
else
  echo BUILD_FAIL
  tail -30 /tmp/build_watch.log
  pm2 restart all
  crontab /tmp/cron.bak.watch
  pm2 save
  exit 1
fi
END=$(date +%s)
echo "build seconds: $((END-START))"

echo "== 同步静态资源（restart 前！铁律）=="
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
chmod -R a+rX .next/standalone .next/static
echo CP_OK

echo "== 恢复 =="
pm2 restart all
crontab /tmp/cron.bak.watch
pm2 save
sleep 3
pm2 list | grep -c online
echo DEPLOY_DONE
