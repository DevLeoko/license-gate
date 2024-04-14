import express from "express";
import {
  Body,
  Controller,
  Example,
  Get,
  Path,
  Post,
  Query,
  Request,
  Response,
  Route,
  Tags,
} from "tsoa";
import { z } from "zod";
import { verifyLicense } from "../../controller/verify-license";
import { ShowError } from "../../utils/ShowError";
import { ResponseError } from "../../utils/tsoa-response-error";
import { hexToUserId } from "../../utils/user-id";

const verifyLicenseSchema = z
  .object({
    licenseKey: z.string(),
    userId: z.number().int(),
    options: z
      .object({
        scope: z.string().optional(),
        challenge: z.string().optional(),
        metadata: z.string().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

/**
 * The result of the license verification.
 * - `VALID`: The license is valid
 * - `NOT_FOUND`: The license was not found
 * - `NOT_ACTIVE`: The license is not active
 * - `EXPIRED`: The license has expired
 * - `LICENSE_SCOPE_FAILED`: The scope of the license does not match the scope in the request
 * - `IP_LIMIT_EXCEEDED`: The IP limit has been exceeded
 * - `RATE_LIMIT_EXCEEDED`: The rate limit has been exceeded
 * @example "VALID"
 */
type ValidationResult =
  | "VALID"
  | "NOT_FOUND"
  | "NOT_ACTIVE"
  | "EXPIRED"
  | "LICENSE_SCOPE_FAILED"
  | "IP_LIMIT_EXCEEDED"
  | "RATE_LIMIT_EXCEEDED";

interface ValidationResponse {
  /**
   * Whether the license is valid. (Short for `result == "VALID"`)
   * @example true
   */
  valid: boolean;

  result: ValidationResult;

  /**
   * The challenge signed by the server. Only present if a challenge was provided in the request.
   * @example "23fa25/7dd..."
   */
  signedChallenge?: string;
}

/**
 * Options for the license verification.
 */
interface VerificationOptions {
  /**
   * The scope of the license. Required if the license has a <a href="restriction-options/scope">scope restriction</a>
   * @example "premium"
   */
  scope?: string;

  /**
   * A challenge that will be signed by the server. We recommend to use the current time in milliseconds as the challenge. See <a href="security-considerations">Security considerations</a> for more information.
   * @example "1634567890123"
   */
  challenge?: string;

  /**
   * A string that will be logged with the license verification. This can be used to log additional information about the verification request.
   */
  metadata?: string;
}

@Route("/license")
@Tags("Public")
export class LicenseVerifyController extends Controller {
  /**
   * Verify a license
   * @param userId The user ID (from web panel) that owns the license
   * @param licenseKey The license key
   * @param scope The scope of the license. Required if the license has a <a href="restriction-options/scope">scope restriction</a>
   * @param challenge A challenge that will be signed by the server. We recommend to use the current time in milliseconds as the challenge. See <a href="security-considerations">Security considerations</a> for more information.
   * @param metadata A string that will be logged with the license verification. This can be used to log additional information about the verification request.
   * @summary Verify license
   */
  @Get("{userId}/{licenseKey}/verify")
  @Response<ResponseError<"invalid-schema">>(422, "Invalid request schema")
  @Example(
    {
      valid: true,
      result: "VALID",
    },
    "License is valid"
  )
  @Example(
    {
      valid: true,
      result: "VALID",
      signedChallenge: "23fa25/7dd...",
    },
    "License is valid (signed challenge)"
  )
  @Example(
    {
      valid: false,
      result: "EXPIRED",
    },
    "License has expired"
  )
  @Example(
    {
      valid: false,
      result: "NOT_FOUND",
    },
    "License not found"
  )
  @Example(
    {
      valid: false,
      result: "LICENSE_SCOPE_FAILED",
    },
    "License scope does not match"
  )
  public async verifyLicenseGet(
    @Request() req: express.Request,
    @Path() userId: string,
    @Path() licenseKey: string,
    @Query() scope?: VerificationOptions["scope"],
    @Query() challenge?: string,
    @Query() metadata?: string
  ): Promise<ValidationResponse> {
    const options = {
      scope,
      challenge,
      metadata,
    };

    return processLicenseVerification(req, licenseKey, userId, options);
  }

  /**
   * Verify a license
   * @param userId The user ID (from web panel) that owns the license
   * @param licenseKey The license key
   * @summary Verify license
   */
  @Response<ResponseError<"invalid-schema">>(422, "Invalid request schema")
  @Example(
    {
      valid: true,
      result: "VALID",
    },
    "License is valid"
  )
  @Example(
    {
      valid: true,
      result: "VALID",
      signedChallenge: "23fa25/7dd...",
    },
    "License is valid (signed challenge)"
  )
  @Example(
    {
      valid: false,
      result: "EXPIRED",
    },
    "License has expired"
  )
  @Example(
    {
      valid: false,
      result: "NOT_FOUND",
    },
    "License not found"
  )
  @Example(
    {
      valid: false,
      result: "LICENSE_SCOPE_FAILED",
    },
    "License scope does not match"
  )
  @Post("{userId}/{licenseKey}/verify")
  public async verifyLicensePost(
    @Request() req: express.Request,
    @Path() userId: string,
    @Path() licenseKey: string,
    @Body() requestBody: VerificationOptions
  ): Promise<ValidationResponse> {
    return processLicenseVerification(req, licenseKey, userId, requestBody);
  }
}

function getIpFromRequest(req: express.Request): string {
  return (req.headers["cf-connecting-ip"] as string | undefined) || req.ip;
}

async function processLicenseVerification(
  req: express.Request,
  licenseKey: string,
  userId: string,
  options: VerificationOptions
): Promise<ValidationResponse> {
  const userIdNumber = hexToUserId(userId);

  try {
    verifyLicenseSchema.parse({
      licenseKey,
      userId: userIdNumber,
      options,
    });
  } catch (e) {
    throw new ShowError("Invalid request schema", "invalid-schema");
  }

  const verificationResult = await verifyLicense(
    licenseKey,
    userIdNumber,
    getIpFromRequest(req),
    options
  );

  return {
    valid: verificationResult.result === "VALID",
    result: verificationResult.result,
    signedChallenge: verificationResult.signedChallenge,
  };
}
