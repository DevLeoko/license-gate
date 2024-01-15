import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";

export const logsRouter = router({
  quickStats: protectedProcedure.query(async ({ ctx }) => {
    // Active licenses
    // Successful checks in the last 7 days (and 7 days before that)
    // Failed checks in the last 7 days (and 7 days before that)
    // Time of last successful check

    const [
      activeLicenses,
      successfulChecksLast7Days,
      failedChecksLast7Days,
      successfulCheckPrevious7Days,
      failedCheckPrevious7Days,
      lastSuccessfulCheck,
    ] = await Promise.all([
      prisma.license.count({
        where: {
          userId: ctx.userId,
          active: true,
          expirationDate: {
            gt: new Date(),
          },
        },
      }),
      prisma.log.count({
        where: {
          userId: ctx.userId,
          result: "VALID",
          timestamp: {
            gt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          },
        },
      }),
      prisma.log.count({
        where: {
          userId: ctx.userId,
          result: {
            not: "VALID",
          },
          timestamp: {
            gt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          },
        },
      }),
      prisma.log.count({
        where: {
          userId: ctx.userId,
          result: "VALID",
          timestamp: {
            gt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
            lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          },
        },
      }),
      prisma.log.count({
        where: {
          userId: ctx.userId,
          result: {
            not: "VALID",
          },
          timestamp: {
            gt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
            lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          },
        },
      }),
      prisma.log.findFirst({
        where: {
          userId: ctx.userId,
          result: "VALID",
        },
        orderBy: {
          timestamp: "desc",
        },
      }),
    ]);

    return {
      activeLicenses,
      successfulChecksLast7Days,
      failedChecksLast7Days,
      successfulCheckPrevious7Days,
      failedCheckPrevious7Days,
      lastSuccessfulCheck: lastSuccessfulCheck?.timestamp,
    };
  }),
});
