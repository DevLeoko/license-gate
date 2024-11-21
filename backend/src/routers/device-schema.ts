import { z } from "zod";

export const deviceCreateSchema = z.object({
  createdAt: z.date(),
  isActive: z.boolean(),

  deviceId: z.string().min(1).max(100),
});

export type DeviceCreateInput = z.infer<typeof deviceCreateSchema>;

export const deviceListSchema = z.object({
  take: z.number().int().nonnegative().max(100),
  skip: z.number().int().nonnegative(),
  filterStatus: z.enum(["active", "disabled/expired"]).optional(),
});

export type DeviceListInput = z.infer<typeof deviceListSchema>;
