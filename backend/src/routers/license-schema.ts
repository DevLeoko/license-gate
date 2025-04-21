import { z } from "zod";

export const licenseCreateSchema = z.object({
  name: z.string().max(100),
  notes: z.string().max(15000),

  active: z.boolean(),

  ipLimit: z.number().int().nullish(),
  licenseScope: z.string().nullish(),
  expirationDate: z.date().nullish(),

  validationPoints: z.number().int().nullish(),
  validationLimit: z.number().int().nullish(),
  replenishAmount: z.number().int().nullish(),
  replenishInterval: z
    .enum(["TEN_SECONDS", "MINUTE", "HOUR", "DAY"])
    .nullish(),

  licenseKey: z.string().min(1).max(100).optional(),
});

export type LicenseCreateInput = z.infer<typeof licenseCreateSchema>;

export const licenseListSchema = z.object({
  take: z.number().int().nonnegative().max(100),
  skip: z.number().int().nonnegative(),
  filterStatus: z.enum(["active", "disabled/expired"]).optional(),
});

export type LicenseListInput = z.infer<typeof licenseListSchema>;
