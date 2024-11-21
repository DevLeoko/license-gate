import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router } from "../trpc";
import { apiKeyRouter } from "./apiKey";
import { authRouter } from "./auth";
import { licenseRouter } from "./license";
import { logsRouter } from "./logs";
import { deviceRouter } from "./device";

export const appRouter = router({
  auth: authRouter,
  license: licenseRouter,
  device: deviceRouter,
  logs: logsRouter,
  apiKey: apiKeyRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;
