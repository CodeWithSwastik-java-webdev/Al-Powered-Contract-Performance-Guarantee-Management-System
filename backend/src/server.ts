import "dotenv/config";
import { createApp } from "./app";
import { env } from "./config";
import { connectDatabase, disconnectDatabase } from "./prisma/client";
import { logger } from "./utils";

async function bootstrap(): Promise<void> {
  await connectDatabase();
  logger.info("Database connected");

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(
      { port: env.PORT, env: env.NODE_ENV },
      "CPG API server started",
    );
  });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Shutting down gracefully");

    server.close(async () => {
      await disconnectDatabase();
      logger.info("Server closed");
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
}

bootstrap().catch((error) => {
  logger.fatal({ err: error }, "Failed to start server");
  process.exit(1);
});
