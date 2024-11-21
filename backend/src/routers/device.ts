import Container from "typedi";
import {z} from "zod";
import {DeviceService} from "../controller/device.controller";
import {protectedAndLicensedProcedure, protectedProcedure, router} from "../trpc";
import {deviceCreateSchema, deviceListSchema} from "./device-schema";

const deviceService = Container.get(DeviceService);

export const deviceRouter = router({
  create: protectedAndLicensedProcedure
    .input(deviceCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return deviceService.create({
        device: input,
        licenseId: ctx.licenseId,
        userId: ctx.userId,
      });
    }),

  read: protectedProcedure
    .input(z.object({ deviceId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await deviceService.read({
        deviceId: input.deviceId,
        checkUserId: ctx.userId,
        includeLogs: true,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({}).merge(deviceCreateSchema)
    )
    .mutation(async ({ ctx, input }) => {
      return await deviceService.update({
        device: input,
        checkUserId: ctx.userId,
        includeLogs: true
      });
    }),

  delete: protectedProcedure
    .input(z.object({ deviceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await deviceService.delete({
        deviceId: input.deviceId,
        checkUserId: ctx.userId,
        includeLogs: true,
      });
    }),

  countActive: protectedProcedure.query(async ({ ctx }) => {
    return deviceService.countActive({ userId: ctx.userId });
  }),

  list: protectedProcedure
    .input(deviceListSchema)
    .query(async ({ ctx, input }) => {
      return await deviceService.list({
        userId: ctx.userId,
        take: input.take,
        skip: input.skip,
        filterStatus: input.filterStatus,
        includeLogs: true,
      });
    }),
});
