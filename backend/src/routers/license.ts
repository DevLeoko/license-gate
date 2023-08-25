import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { z } from "zod";
import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";
import { ShowError } from "../utils/ShowError";
import { licenseCreateSchema } from "./license-schema";

const INCLUDE_LAST_7_DAYS_LOGS: Prisma.LicenseInclude = {
  logs: {
    where: {
      timestamp: {
        gt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      },
    },
    orderBy: {
      timestamp: "desc",
    },
    take: 50,
  },
};

export const licenseRouter = router({
  create: protectedProcedure
    .input(licenseCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const licenseKey = input.licenseKey || randomUUID();

      return await prisma.license.create({
        data: {
          ...input,
          userId: ctx.userId,
          licenseKey,
        },
      });
    }),

  read: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const license = await prisma.license.findFirst({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
        include: INCLUDE_LAST_7_DAYS_LOGS,
      });

      if (!license) {
        throw new ShowError("License not found");
      }

      return license;
    }),

  update: protectedProcedure
    .input(
      z.object({ id: z.number().int() }).merge(licenseCreateSchema.partial())
    )
    .mutation(async ({ ctx, input }) => {
      const license = await prisma.license.findFirst({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
      });

      if (!license) {
        throw new ShowError("License not found");
      }

      return await prisma.license.update({
        include: INCLUDE_LAST_7_DAYS_LOGS,
        where: {
          id: input.id,
        },
        data: input,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const license = await prisma.license.findFirst({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
      });

      if (!license) {
        throw new ShowError("License not found");
      }

      return await prisma.license.delete({
        include: INCLUDE_LAST_7_DAYS_LOGS,
        where: {
          id: input.id,
        },
      });
    }),

  list: protectedProcedure
    .input(
      z.object({
        take: z.number().int().nonnegative().max(100),
        skip: z.number().int().nonnegative(),
        filterStatus: z.enum(["active", "disabled/expired"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Prisma.LicenseWhereInput = {
        userId: ctx.userId,
      };

      if (input.filterStatus == "active") {
        where.expirationDate = {
          gt: new Date(),
        };
        where.active = true;
      } else if (input.filterStatus == "disabled/expired") {
        where.OR = [
          {
            expirationDate: {
              lt: new Date(),
            },
          },
          {
            active: false,
          },
        ];
      }

      const [licenses, count] = await Promise.all([
        prisma.license.findMany({
          where,
          take: input.take,
          skip: input.skip,
          include: INCLUDE_LAST_7_DAYS_LOGS,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.license.count({ where }),
      ]);

      return {
        licenses,
        count,
      };
    }),
});
