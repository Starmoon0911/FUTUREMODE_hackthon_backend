import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";

import { env } from "./config/env.js";

const allowedOrigins = env.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Vercel's Express auto-detection loads `src/app.ts` as the serverless
// function entry, so the default export must be the configured Express app.
// Without this, the runtime rejects the module with `Invalid export found in
// module "/var/task/src/app.js"` and every request crashes with a 500
// (FUNCTION_INVOCATION_FAILED) before the not-found middleware can run.
export const app = express();
export default app;

app.disable("x-powered-by");
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS"));
    },
  }),
);
app.use(express.json({ limit: "1mb" }));

export function healthCheck(_request: Request, response: Response): void {
  response.status(200).json({ status: "ok" });
}

app.get("/health", healthCheck);
app.get("/api/health", healthCheck);

export function notFound(_request: Request, response: Response): void {
  response.status(404).json({ error: "Not found" });
}

app.use(notFound);

// Keep error responses predictable and do not leak implementation details.
app.use(
  (
    error: Error,
    _request: Request,
    response: Response,
    // Express recognises this function as error middleware by its four arguments.
    next: NextFunction,
  ) => {
    void next;
    if (error.message === "Origin is not allowed by CORS") {
      response.status(403).json({ error: "Origin is not allowed" });
      return;
    }

    console.error("Unhandled request error", error);
    response.status(500).json({ error: "Internal server error" });
  },
);
