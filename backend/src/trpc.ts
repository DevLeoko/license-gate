import { initTRPC } from "@trpc/server";
import { Response } from "express";
import SuperJSON from "superjson";

const t = initTRPC.context<{ userId?: number; res: Response }>().create({
  transformer: SuperJSON,
});

const isAuthenticated = t.middleware(({ next, ctx }) => {
  if (ctx.userId == undefined) {
    throw "error.notAuthenticated";
  }

  return next({
    ctx: {
      userId: ctx.userId!,
      res: ctx.res,
    },
  });
});

export const middleware = t.middleware;
export const router = t.router;
export const mergeRouters = t.mergeRouters;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthenticated);
