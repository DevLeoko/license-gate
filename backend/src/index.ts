/// <reference path="./types/env.d.ts" />
import "dotenv-safe/config";
import "reflect-metadata";

import * as trpcExpress from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { authExpressMiddleware } from "./controller/auth-flows";
import { setupRateLimitReplenishCron } from "./controller/license-rate-limit";
import { appRouter } from "./routers/_app";
import { RegisterRoutes } from "./tsoa-generated/routes";
import { ShowError } from "./utils/ShowError";
import { tsoaErrorHandler } from "./utils/tsoa-response-error";

const app = express();

app.use(
  "/trpc",
  cors({ origin: process.env.CORS_ORIGIN.split(","), credentials: true })
);

const allCors = cors({ origin: "*" });
const urlencoded = express.urlencoded({
  extended: true,
});
const json = express.json();

app.use((req, res, next) => {
  if (req.url.startsWith("/trpc")) return next();
  allCors(req, res, () => {
    urlencoded(req, res, () => {
      json(req, res, next);
    });
  });
});

app.use(cookieParser());

app.use(authExpressMiddleware);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => {
      return { userId: req.userId, res };
    },
    onError(data) {
      if (
        data.error.message?.startsWith("error.") ||
        data.error.message?.startsWith("+ ")
      )
        return;

      console.error(data.error);
      data.error.message = ShowError.internalServerError().message;
    },
  })
);

setupRateLimitReplenishCron();

RegisterRoutes(app);

app.use(tsoaErrorHandler);

app.listen(process.env.PORT, () => {
  console.log(`\n📄 Server ready on port ${process.env.PORT}\n`);
});
