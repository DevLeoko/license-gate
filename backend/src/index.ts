/// <reference path="./types/env.d.ts" />

import "dotenv-safe/config";

import * as trpcExpress from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { authExpressMiddleware } from "./controller/auth-flows";
import { setupRateLimitReplenishCron } from "./controller/license-rate-limit";
import { appRouter } from "./routers/_app";
import { setupNonTrpcRoutes } from "./routers/non-trpc/_router";
import { ShowError } from "./utils/ShowError";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(cookieParser());

app.use(authExpressMiddleware);

setupNonTrpcRoutes(app);

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

app.listen(process.env.PORT, () => {
  console.log(`\n📄 Server ready on port ${process.env.PORT}\n`);
});
