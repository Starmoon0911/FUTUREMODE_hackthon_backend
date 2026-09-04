import { app } from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.info(`API listening on port ${env.PORT}`);
});

function shutdown(signal: string): void {
  console.info(`${signal} received; closing HTTP server`);
  server.close((error) => {
    if (error) {
      console.error("Failed to close HTTP server", error);
      process.exitCode = 1;
    }
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
