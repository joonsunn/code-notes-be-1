import express from "express";
import http from "http";
import os from "os";
import "module-alias/register";
import { addNumber } from "@libs/addNumber";
import authRoutes from "@routes/auth.routes";
import { PORT as envPort, corsOptions } from "@src/config/config";
import cors from "cors";
import v1Routes from "@routes/v1.routes";
import { errorHandler } from "@src/middlewares/error.middleware";
import { ERROR_NOT_FOUND } from "@src/config/httpErrors.config";

const internalIp = Object.values(os.networkInterfaces())
  .flat()
  .filter((item) => item?.family === "IPv4" && !item?.internal)[0]?.address;

const PORT = envPort ?? 3000;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors(corsOptions));
app.disable("x-powered-by");

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

  app.use("/api/v1", v1Routes);

  app.get("/addNumber", (req, res) => {
    const { a, b } = req.query;
    const result = addNumber(Number(a), Number(b));
    res.send(`Result: ${result}`);
  });

  app.use("/*", (req, res, next) => {
    try {
      // throw new HttpError("Not Found", 404);
      throw ERROR_NOT_FOUND;
    } catch (error) {
      next(error);
    }
    // const error = new Error("Not Found");
    // (error as any).status = 404;
    // next(error);
  });

  app.use(errorHandler);

  server.listen(PORT, () =>
    console.log(
      `Server successfully started!
Local:            http://localhost:${PORT}
On your network:  http://${internalIp}:${PORT}`
    )
  );
}

main();
