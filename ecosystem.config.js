module.exports = {
  apps: [
    {
      name: "code-notes-be-PROD",
      cwd: "./dist",
      script: "index.js",
      instances: 2,
      exec_mode: "cluster",
      autorestart: true,
      max_memory_restart: "300M",

      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
