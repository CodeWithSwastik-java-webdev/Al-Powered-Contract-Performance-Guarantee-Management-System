import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config";
import {
  attachRequestId,
  errorHandler,
  httpLogger,
  notFoundHandler,
} from "./middleware";
import routes from "./routes";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(",").map((o) => o.trim()),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(attachRequestId);
  app.use(httpLogger);

  app.use("/api/v1", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
