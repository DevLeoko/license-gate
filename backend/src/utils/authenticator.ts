/// <reference path="../types/env.d.ts" />

import argon2 from "argon2";
import jwt from "jsonwebtoken";

type AuthResponse<T, E extends string> =
  | { success: false; data: { errorType: E; errorData?: any } }
  | { success: true; data: T };

// AUTH-FLOWS
// Sign up (password):
// 1. User enters email and password
// 2. Create non-verified user with email and #hashPassword(password)
// 3. Send mail with #generateMailToken(email)
// 4. User clicks link in mail
// 5. Verify mail with #verifyMailToken(token, email)
// 6. Set user to verified
// User can now login

// Login (password):
// 1. User enters email and password
// 2. Get verified user with email
// 3. Login with #loginWithPassword(passwordHash, password, data)
// 4. User gets access token and refresh token as http-only cookies
// 5. Set refresh session in DB
// User is now logged in

// Change/reset password:
// 1. User enters email
// 2. Get verified user with email and send mail with #generateMailToken(email)
// 3. User clicks link in mail and enters new password
// 4. Verify mail with #verifyMailToken(token, email)
// 5. Set user password to #hashPassword(password)

// On every request:
// 1. Get access token from http-only cookie
// 2. Verify access token with #verifyAccessToken(accessToken)
// 3. If access token is valid, user is logged in
// 4. If access token is invalid, get refresh token from http-only cookie and refresh session from DB
// 5. Refresh access token with #refreshAccessToken(refreshToken, refreshSession)
// 6. If refresh token is valid, update access token in http-only cookie

export class Authenticator<T extends Record<string, any>> {
  constructor(private readonly secret: string) {}

  private generateRandomString(length: number) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  async loginWithPassword(
    passwordHash: string,
    password: string,
    data: T,
    existingRefreshSession?: string
  ): Promise<
    AuthResponse<
      { accessToken: string; refreshToken: string; refreshSession: string },
      "invalid-password"
    >
  > {
    if (!(await argon2.verify(passwordHash, password)))
      return { success: false, data: { errorType: "invalid-password" } };

    return {
      success: true,
      data: this.directLogin(data, existingRefreshSession),
    };
  }

  directLogin(data: T, existingRefreshSession: string | undefined) {
    const refreshSession =
      existingRefreshSession || this.generateRandomString(32);
    const accessToken = this.generateAccessToken(data);
    const refreshToken = jwt.sign({ data, refreshSession }, this.secret, {
      expiresIn: "6d",
    });

    return {
      accessToken,
      refreshToken,
      refreshSession,
    };
  }

  private generateAccessToken(data: T) {
    return jwt.sign({ data }, this.secret, {
      expiresIn: "1h",
    });
  }

  async refreshAccessToken(
    refreshToken: string,
    refreshSession: (data: T) => Promise<string | null>
  ): Promise<
    AuthResponse<
      { accessToken: string; data: T },
      "invalid-token" | "invalid-session"
    >
  > {
    try {
      const { data, refreshSession: tokenRefreshSession } = jwt.verify(
        refreshToken,
        this.secret
      ) as { data: T; refreshSession: string };

      const session = await refreshSession(data);
      if (tokenRefreshSession !== session || !session)
        return { success: false, data: { errorType: "invalid-session" } };

      const accessToken = this.generateAccessToken(data);

      return {
        success: true,
        data: { accessToken, data },
      };
    } catch (err) {
      return { success: false, data: { errorType: "invalid-token" } };
    }
  }

  generateMailToken(email: string) {
    return jwt.sign({ email: email.toLowerCase() }, this.secret, {
      expiresIn: "36h",
    });
  }

  verifyMailToken(token: string, email: string): boolean {
    try {
      const { email: tokenEmail } = jwt.verify(token, this.secret) as {
        email: string;
      };

      return email.toLowerCase() === tokenEmail;
    } catch (err) {
      return false;
    }
  }

  verifyAccessToken(accessToken: string): AuthResponse<T, "invalid-token"> {
    try {
      const { data } = jwt.verify(accessToken, this.secret) as { data: T };

      return {
        success: true,
        data,
      };
    } catch (err) {
      return { success: false, data: { errorType: "invalid-token" } };
    }
  }

  hashPassword(password: string) {
    return argon2.hash(password);
  }
}

// invite: email -> void
// resetMail: email -> void

// changePassword: pw-token, newPassword -> void
// login: passwordHash, password, DATA -> auth-token, passwordSession
// verify: auth-token, passwordSession -> DATA | error

// loginWithPassword: password, passwordHash, DATA -> accessToken, refreshToken
// loginWithGoogle: googleToken -> accessToken, refreshToken

// register: password,
