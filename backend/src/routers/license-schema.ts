import { z } from "zod";

export const licenseCreateSchema = z.object({
  name: z.string().max(100),
  notes: z.string().max(15000),

  active: z.boolean(),

  ipLimit: z.number().int().nullable(),
  licenseScope: z.string().nullable(),
  expirationDate: z.date().nullable(),

  validationPoints: z.number().int().nullable(),
  validationLimit: z.number().int().nullable(),
  replenishAmount: z.number().int().nullable(),
  replenishInterval: z
    .enum(["TEN_SECONDS", "MINUTE", "HOUR", "DAY"])
    .nullable(),

  licenseKey: z.string().min(1).max(100).optional(),
});
