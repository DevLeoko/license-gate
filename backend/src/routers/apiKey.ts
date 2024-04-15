import { randomUUID } from "crypto";
import { z } from "zod";
import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";

function censorApiKey<T extends { key: string }>(apiKey: T) {
  return {
    ...apiKey,
    key: apiKey.key.slice(0, 4) + "..." + apiKey.key.slice(-2),
  };
}

export const apiKeyRouter = router({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx: { userId }, input: { name } }) => {
      const apiKeyKey = randomUUID();
      const apiKey = await prisma.apiKey.create({
        data: { name, userId, key: apiKeyKey },
      });

      return {
        apiKey: censorApiKey(apiKey),
        uncensoredApiKey: apiKey,
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(
      async ({ ctx: { userId }, input: { id } }) =>
        await prisma.apiKey.deleteMany({ where: { id, userId } })
    ),

  list: protectedProcedure.query(async ({ ctx: { userId } }) => {
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId },
      take: 100,
    });
    return apiKeys.map(censorApiKey);
  }),
});
