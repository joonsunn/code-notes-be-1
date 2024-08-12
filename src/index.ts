import express from "express";
import http from "http";
import os from "os";
import "module-alias/register";

const internalIp = Object.values(os.networkInterfaces())
  .flat()
  .filter((item) => item?.family === "IPv4" && !item?.internal)[0]?.address;

const PORT = process.env.PORT ?? 3000;

const app = express();
const server = http.createServer(app);

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
const gracefulShutdown = function (msg: string, callback: () => void) {
  console.log(msg);
  callback();
};
// For nodemon restarts
process.once("SIGUSR2", function () {
  gracefulShutdown("nodemon restart", function () {
    process.kill(process.pid, "SIGUSR2");
  });
});
// For app termination
process.on("SIGINT", function () {
  gracefulShutdown("\napp terminated via Ctrl+C", function () {
    server.close(() => {
      process.exit(0);
    });
  });
});
// For deployed  app termination
process.on("SIGTERM", function () {
  gracefulShutdown("deployed app termination", function () {
    server.close(() => {
      process.exit(0);
    });
  });
});

function main() {
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  server.listen(PORT, () =>
    console.log(
      `Server successfully started!
Local:            http://localhost:${PORT}
On your network:  http://${internalIp}:${PORT}`
    )
  );
}

main();
