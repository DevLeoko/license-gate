import { Request, Response } from "express";
import { hexToUserId } from "../../utils/user-id";

import { z } from "zod";
import { verifyLicense } from "../../controller/verify-license";

export const verifyLicenseSchema = z
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

export async function handleLicenseKeyVerification(
  req: Request,
  res: Response
) {
  try {
    // Get User ID and license key from path parameters
    const userId = hexToUserId(req.params.userId);
    const licenseKey = req.params.licenseKey;

    const options =
      req.method == "POST" ? JSON.parse(req.body || "{}") : req.query;

    // Validate input
    const isValid = verifyLicenseSchema.safeParse({
      licenseKey,
      userId,
      options,
    });

    if (!isValid.success) {
      return res.status(400).json({
        valid: false,
        error: "INVALID_REQUEST_SCHEMA",
      });
    }

    const verificationResult = await verifyLicense(
      licenseKey,
      userId,
      getIpFromRequest(req),
      options
    );

    return res.status(200).json({
      valid: verificationResult.result === "VALID",
      result: verificationResult.result,
      signedChallenge: verificationResult.signedChallenge,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      valid: false,
      error: "INTERNAL_SERVER_ERROR",
    });
  }
}

function getIpFromRequest(req: Request): string {
  return (req.headers["cf-connecting-ip"] as string | undefined) || req.ip;
}
