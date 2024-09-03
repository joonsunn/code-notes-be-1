import { Request, Response, NextFunction } from "express";
import { NODE_ENV as envNODE_ENV } from "@src/config/config";

// Custom Error Interface
interface CustomError extends Error {
  status?: number;
}

// Error Handling Middleware
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Log the error details (you might want to log this to a file or external service)
  console.error(
    `[Error] ${status} - ${message} - ${req.headers.host} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  const errorJSON: { status: number; message: string; stack?: string } = {
    status,
    message,
    // stack: process.env.NODE_ENV === "production" ? null : err.stack, // Hide stack trace in production
  };

  const NODE_ENV = envNODE_ENV ?? "";
  // console.log(NODE_ENV, typeof NODE_ENV);

  if (NODE_ENV?.includes("dev") || !["prod", "production"].includes(NODE_ENV)) {
    errorJSON.stack = err.stack;
  }

  res.status(status).json(errorJSON);
};
