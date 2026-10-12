module.exports = {
  apps: [{
    name: "aizaowu",
    script: "server.js",
    cwd: "/var/www/aizaowu/.next/standalone",
    instances: 1,
    max_memory_restart: "200M",
    env: {
      NODE_ENV: "production",
      PORT: 3006
    }
  }]
};
