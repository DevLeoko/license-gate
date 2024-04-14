import { z } from "zod";
import {
  loginWithGoogle,
  loginWithPassword,
  requestPasswordReset,
  resetPassword,
  signUpWithPassword,
  verifyMailToken,
} from "../controller/auth-flows";
import { prisma } from "../prisma";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { ShowError } from "../utils/ShowError";
import { verifyRecaptcha } from "../utils/recaptcha";
import { userIdToHex } from "../utils/user-id";

export const authRouter = router({
  loginWithPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { accessToken, refreshToken, userId } = await loginWithPassword(
        input.email,
        input.password
      );

      ctx.res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      ctx.res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      return { userId: userIdToHex(userId) };
    }),

  signUpWithPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        email: z.string().email(),
        password: z.string(),
        marketingEmails: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!verifyRecaptcha(input.token))
        throw new ShowError("Failed captcha", "failed-captcha");

      await signUpWithPassword(
        input.email,
        input.password,
        input.marketingEmails
      );
    }),

  loginWithGoogle: publicProcedure
    .input(
      z.object({
        token: z.string(),
        createAccountIfNotFound: z.boolean(),
        marketingEmails: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { accessToken, refreshToken, userId, email } =
        await loginWithGoogle(
          input.token,
          input.createAccountIfNotFound,
          input.marketingEmails
        );

      ctx.res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      ctx.res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      return { userId: userIdToHex(userId), email };
    }),

  verifyEmail: publicProcedure
    .input(
      z.object({
        token: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      await verifyMailToken(input.token, input.email);
    }),

  // TODO: add google recaptcha check for public reset requests
  requestPasswordReset: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      if (!verifyRecaptcha(input.token))
        throw new ShowError("Failed captcha", "failed-captcha");

      const user = await prisma.user.findUnique({
        where: { email: input.email },
        select: { email: true },
      });

      if (user) {
        await requestPasswordReset(input.email);
      } // We don't want to leak if a user exists or not
    }),

  requestPasswordResetNoCaptcha: protectedProcedure
    .input(z.object({ signOutAllDevices: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { email: true, passwordHash: true },
      });

      if (!user || !user.passwordHash) {
        throw ShowError.internalServerError();
      }

      if (input.signOutAllDevices) {
        await prisma.user.update({
          where: { id: ctx.userId },
          data: { refreshSession: null },
        });
      }

      await requestPasswordReset(user.email);
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await resetPassword(input);
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: { id: ctx.userId },
      select: {
        email: true,
        passwordHash: true,
        marketingEmails: true,
        rsaPublicKey: true,
      },
    });

    if (!user) {
      throw ShowError.internalServerError();
    }

    return {
      userId: userIdToHex(ctx.userId),
      email: user.email,
      isPasswordAccount: !!user.passwordHash,
      marketingEmails: user.marketingEmails,
      rsaPublicKey: user.rsaPublicKey,
    };
  }),

  update: protectedProcedure
    .input(z.object({ marketingEmails: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await prisma.user.update({
        where: { id: ctx.userId },
        data: { marketingEmails: input.marketingEmails },
      });
    }),

  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    await prisma.user.delete({ where: { id: ctx.userId } });
  }),

  updateRsaPublicKey: protectedProcedure
    .input(z.object({ rsaPublicKey: z.string(), rsaPrivateKey: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await prisma.user.update({
        where: { id: ctx.userId },
        data: {
          rsaPublicKey: input.rsaPublicKey,
          rsaPrivateKey: input.rsaPrivateKey,
        },
      });
    }),
});
