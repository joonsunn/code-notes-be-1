module.exports = {
  apps: [
    {
      name: "code-notes-be-DEV",
      cwd: "./dist",
      script: "index.js",
      watch_delay: 1000,
      instances: 2,
      exec_mode: "cluster",
      autorestart: true,
    },
    // {
    //   name: "code-notes-be-DEV",
    //   script: "npm run dev",
    //   watch_delay: 1000,
    // },
    {
      name: "TSC-watch",
      script: "npx tsc --watch",
      watch_delay: 1000,
    },
    {
      name: "TSC-alias-watch",
      script: "npx tsc-alias -p tsconfig.json --watch",
      watch_delay: 1000,
    },
  ],
};
