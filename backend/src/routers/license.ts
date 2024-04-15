import Container from "typedi";
import { z } from "zod";
import { LicenseService } from "../controller/license.controller";
import { protectedProcedure, router } from "../trpc";
import { licenseCreateSchema, licenseListSchema } from "./license-schema";

const licenseService = Container.get(LicenseService);

export const licenseRouter = router({
  create: protectedProcedure
    .input(licenseCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return licenseService.create({
        license: input,
        userId: ctx.userId,
      });
    }),

  read: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ ctx, input }) => {
      return await licenseService.read({
        licenseId: input.id,
        checkUserId: ctx.userId,
        includeLogs: true,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({ id: z.number().int() }).merge(licenseCreateSchema.partial())
    )
    .mutation(async ({ ctx, input }) => {
      return await licenseService.update({
        license: input,
        checkUserId: ctx.userId,
        includeLogs: true,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      return await licenseService.delete({
        licenseId: input.id,
        checkUserId: ctx.userId,
        includeLogs: true,
      });
    }),

  countActive: protectedProcedure.query(async ({ ctx }) => {
    return licenseService.countActive({ userId: ctx.userId });
  }),

  list: protectedProcedure
    .input(licenseListSchema)
    .query(async ({ ctx, input }) => {
      return await licenseService.list({
        userId: ctx.userId,
        take: input.take,
        skip: input.skip,
        filterStatus: input.filterStatus,
        includeLogs: true,
      });
    }),
});
