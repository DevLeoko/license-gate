import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";

const validationResultSchema = z.enum([
  "VALID",
  "NOT_FOUND",
  "NOT_ACTIVE",
  "EXPIRED",
  "LICENSE_SCOPE_FAILED",
  "IP_LIMIT_EXCEEDED",
  "RATE_LIMIT_EXCEEDED",
]);

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
          OR: [
            {
              expirationDate: {
                gt: new Date(),
              },
            },
            {
              expirationDate: null,
            },
          ],
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

  histogram: protectedProcedure
    .input(
      z.object({
        interval: z.enum(["minute", "hour", "day", "month"]),
        intervalCount: z.number().int().positive().max(31),
        licenseId: z.number().int().optional(),
      })
    )
    .query(
      async ({
        ctx: { userId },
        input: { interval, intervalCount, licenseId },
      }) => {
        return getHistogramData({
          interval,
          intervalCount,
          licenseId,
          userId,
        });
      }
    ),

  list: protectedProcedure
    .input(
      z.object({
        filter: z.object({
          licenseId: z.number().int().optional(),
          result: z.array(validationResultSchema).optional(),
        }),
        size: z.number().int().positive().max(100).default(25),
        after: z.number().int().optional(),
        before: z.number().int().optional(),
      })
    )
    .query(
      async ({ ctx: { userId }, input: { filter, size, after, before } }) => {
        const where: Prisma.LogWhereInput = {
          userId,
        };

        if (filter?.licenseId) {
          where.licenseId = filter.licenseId;
        }

        if (filter?.result) {
          where.result = { in: filter.result };
        }

        if (after) {
          where.id = { gt: after };
        }

        if (before) {
          where.id = { lt: before };
        }

        const logs = await prisma.log.findMany({
          where,
          orderBy: {
            id: "desc",
          },
          take: size,
          include: {
            license: {
              select: {
                name: true,
                licenseKey: true,
              },
            },
          },
        });

        return logs;
      }
    ),
});

type HistogramRequest = {
  interval: "minute" | "hour" | "day" | "month";
  intervalCount: number;
  licenseId: number | undefined;
  userId: number;
};

export async function getHistogramData(request: HistogramRequest) {
  const query = buildHistogramQuery(request);

  const params = [request.userId];

  if (request.licenseId) {
    params.push(request.licenseId);
  }

  let result: any[] = await prisma.$queryRawUnsafe(query, ...params);

  result = (result as any[]).map((row) => ({
    ...row,
    time_interval: new Date(row.time_interval),
  }));

  const dates = getIntervalDates(request.interval, request.intervalCount);

  const histogram = dates.map((date) => {
    const matchValid = result.find(
      (row) =>
        row.time_interval.getTime() === date.getTime() && row.is_valid === 1
    );
    const matchInvalid = result.find(
      (row) =>
        row.time_interval.getTime() === date.getTime() && row.is_valid === 0
    );
    return {
      date,
      valid: Number(matchValid?.log_count || 0),
      invalid: Number(matchInvalid?.log_count || 0),
    };
  });

  return {
    histogram,
  };
}

function getIntervalDates(
  interval: HistogramRequest["interval"],
  count: number
): Date[] {
  const now = new Date();

  let lastDate = now;
  if (interval === "minute") {
    lastDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes()
    );
  } else if (interval === "hour") {
    lastDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours()
    );
  } else if (interval === "day") {
    lastDate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
  } else if (interval === "month") {
    lastDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth()));
  }

  const dates: Date[] = [lastDate];
  for (let i = 0; i < count - 1; i++) {
    if (interval === "minute") {
      dates.push(new Date(lastDate.getTime() - 1000 * 60));
    } else if (interval === "hour") {
      dates.push(new Date(lastDate.getTime() - 1000 * 60 * 60));
    } else if (interval === "day") {
      dates.push(new Date(lastDate.getTime() - 1000 * 60 * 60 * 24));
    } else if (interval === "month") {
      const newMonth = lastDate.getUTCMonth() - 1;
      if (newMonth < 0) {
        dates.push(new Date(Date.UTC(lastDate.getUTCFullYear() - 1, 11)));
      } else {
        dates.push(new Date(Date.UTC(lastDate.getUTCFullYear(), newMonth)));
      }
    }
    lastDate = dates[dates.length - 1];
  }

  return dates.reverse();
}

function buildHistogramQuery({
  interval,
  intervalCount,
  licenseId,
}: HistogramRequest) {
  let timeFormat: string;
  let dateTrunc: string;

  switch (interval) {
    case "minute":
      timeFormat = "%Y-%m-%d %H:%i:00.000Z";
      dateTrunc = "minute";
      break;
    case "hour":
      timeFormat = "%Y-%m-%d %H:00:00.000Z";
      dateTrunc = "hour";
      break;
    case "day":
      timeFormat = "%Y-%m-%d";
      dateTrunc = "day";
      break;
    case "month":
      timeFormat = "%Y-%m-01";
      dateTrunc = "month";
      break;
    default:
      throw new Error("Invalid interval type");
  }

  return `
    SELECT 
      DATE_FORMAT(timestamp, '${timeFormat}') as time_interval,
      result = 'VALID' as is_valid,
      COUNT(*) as log_count
    FROM 
      Log
    WHERE 
      timestamp >= UTC_TIMESTAMP() - INTERVAL ${intervalCount} ${dateTrunc.toUpperCase()}
      AND userId = ?
      ${licenseId ? `AND licenseId = ?` : ""}
    GROUP BY 
      time_interval, is_valid
    ORDER BY 
      time_interval
  `;
}
