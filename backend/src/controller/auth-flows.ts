import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../prisma";
import { ShowError } from "../utils/ShowError";
import { Authenticator } from "../utils/authenticator";
import { sendMail } from "../utils/mailer";

const googleOAuth = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID);

const authenticator = new Authenticator<{ userId: number }>(
  process.env.JWT_SECRET
);

async function refreshSessionExtractor(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) return null;

  return user.refreshSession;
}

export async function authExpressMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.accessToken;

  if (!token) return next();

  const verifyResult = authenticator.verifyAccessToken(token);
  if (verifyResult.success) {
    req.userId = verifyResult.data.userId;
    return next();
  }

  // Try to refresh token
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return next();

  const refreshResults = await authenticator.refreshAccessToken(
    refreshToken,
    ({ userId }) => refreshSessionExtractor(userId)
  );

  if (refreshResults.success) {
    const { accessToken, data } = refreshResults.data;

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    req.userId = data.userId;
  }

  next();
}

async function fetchEmailFromGoogleToken(token: string) {
  const res = await googleOAuth
    .verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_AUTH_CLIENT_ID,
    })
    .catch(() => {
      throw new ShowError("Google authentication failed.", "google-auth-error");
    });

  const payload = res.getPayload();
  if (!payload)
    throw new ShowError("Google authentication failed.", "google-auth-error");

  const email = payload.email?.toLowerCase();
  if (!email)
    throw new ShowError("Google authentication failed.", "google-auth-error");

  return email;
}

async function updateUserRefreshSession(
  userId: number,
  refreshSession: string
) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      refreshSession,
    },
  });
}

export async function loginWithGoogle(
  token: string,
  createAccountIfNotFound: boolean,
  marketingEmails?: boolean,
  langCode?: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
}> {
  const email = await fetchEmailFromGoogleToken(token);

  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    if (!createAccountIfNotFound)
      throw new ShowError(
        "There is no account linked to this email address. Please sign up.",
        "no-account-for-google-email"
      );

    user = await createUser(email, null, true, marketingEmails ?? false);
  }

  const { accessToken, refreshSession, refreshToken } =
    authenticator.directLogin(
      { userId: user.id },
      user.refreshSession ?? undefined
    );

  if (!user.refreshSession) {
    await updateUserRefreshSession(user.id, refreshSession);
  }

  return { accessToken, refreshToken, userId: user.id, email };
}

export async function loginWithPassword(
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string; userId: number }> {
  email = email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) throw new ShowError("Invalid email or password.", "unauthorized");

  if (!user.isEmailVerified)
    throw new ShowError(
      "Your email address has not been verified.",
      "unauthorized"
    );

  if (!user.passwordHash)
    throw new ShowError(
      "Please use the Google login for this account.",
      "unauthorized"
    );

  const { success, data } = await authenticator.loginWithPassword(
    user.passwordHash,
    password,
    { userId: user.id },
    user.refreshSession ?? undefined
  );

  if (!success)
    throw new ShowError("Invalid email or password.", "unauthorized");

  if (!user.refreshSession) {
    await updateUserRefreshSession(user.id, data.refreshSession);
  }

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    userId: user.id,
  };
}

export async function signUpWithPassword(
  email: string,
  password: string,
  marketingEmails: boolean
) {
  email = email.toLowerCase();

  await createUser(email, password, false, marketingEmails);

  const mailToken = authenticator.generateMailToken(email);
  const verifyUrl = `${process.env.SIGN_IN_URL}?token=${encodeURIComponent(
    mailToken
  )}&email=${encodeURIComponent(email)}`;

  await sendMail(email, "Verify your email", "verify-email", {
    url: verifyUrl,
  });
}

export async function verifyMailToken(token: string, email: string) {
  email = email.toLowerCase();

  const isValid = authenticator.verifyMailToken(token, email);
  if (!isValid)
    throw new ShowError("This link is expired or invalid.", "invalid-token");

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      isEmailVerified: true,
    },
  });
}

async function createUser(
  email: string,
  password: string | null,
  isEmailVerified: boolean,
  marketingEmails: boolean
) {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash:
          password != null ? await authenticator.hashPassword(password) : null,
        isEmailVerified,
        marketingEmails,
        rsaPrivateKey: "",
        rsaPublicKey: "",
      },
    });

    return user;
  } catch (e: any) {
    if (e.code === "P2002") {
      throw new ShowError(
        "This email address is already in use.",
        "email-already-in-use"
      );
    }

    throw e;
  }
}

export async function requestPasswordReset(email: string) {
  email = email.toLowerCase();

  const resetToken = authenticator.generateMailToken(email);
  const resetUrl = `${
    process.env.RESET_PASSWORD_URL
  }?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email)}`;

  await sendMail(email, "Reset your password", "reset-password", {
    url: resetUrl,
  });
}

export async function resetPassword({
  token,
  email,
  password,
}: {
  token: string;
  email: string;
  password: string;
}) {
  email = email.toLowerCase();

  const isValid = authenticator.verifyMailToken(token, email);
  if (!isValid)
    throw new ShowError("This link is expired or invalid.", "invalid-token");

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user)
    throw new ShowError("This link is expired or invalid.", "invalid-token");

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordHash: await authenticator.hashPassword(password),
    },
  });
}
