module.exports = {
  apps: [{
    name: "aizaowu",
    script: "node_modules/.bin/next",
    args: "start -p 3005",
    cwd: "/var/www/aizaowu",
    instances: 2,
    exec_mode: "cluster",
    max_memory_restart: "512M",
    env: {
      NODE_ENV: "production",
      PORT: 3005,
    },
    error_file: "./logs/err.log",
    out_file: "./logs/out.log",
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm:ss",
  }],
};
