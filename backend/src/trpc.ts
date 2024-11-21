import {initTRPC} from "@trpc/server";
import {Response} from "express";
import SuperJSON from "superjson";

const t = initTRPC.context<{
  userId?: number;
  licenseId?: number;
  res: Response;
}>().create({
  transformer: SuperJSON,
});

const isAuthenticated = t.middleware(({next, ctx}) => {
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

const isAuthenticatedAndLicensed = t.middleware(({next, ctx}) => {
  if (ctx.userId == undefined) {
    throw "error.notAuthenticated";
  }

  if (ctx.licenseId == undefined) {
    throw "error.notLicensed";
  }

  return next({
    ctx: {
      userId: ctx.userId!,
      licenseId: ctx.licenseId!,
      res: ctx.res,
    }
  })
})

export const middleware = t.middleware;
export const router = t.router;
export const mergeRouters = t.mergeRouters;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthenticated);

export const protectedAndLicensedProcedure = t.procedure.use(isAuthenticatedAndLicensed);
