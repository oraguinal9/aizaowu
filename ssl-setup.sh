#!/bin/bash
ssh -i ~/.ssh/evoxt root@114.55.148.70 "nginx -s stop && certbot certonly --standalone -d aizaowu.zbjh.top --non-interactive --agree-tos --email admin@zbjh.top && nginx && pm2 restart aizaowu"
