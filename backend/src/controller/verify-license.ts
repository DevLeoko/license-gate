import { License, Prisma } from "@prisma/client";
import NodeRSA from "node-rsa";
import { prisma } from "../prisma";

const DEBUG_TIME = false;

export interface VerificationOptions {
  scope?: string;
  challenge?: string;
  metadata?: string;
}

type VerificationResultStatus = Prisma.LogCreateInput["result"];

export interface VerificationResult {
  result: VerificationResultStatus;
  signedChallenge?: string;
}

async function signChallenge(
  challenge: string,
  rsaPrivateKey: string
): Promise<string> {
  if (!rsaPrivateKey) {
    // TODO: Properly propagate this error to the user
    throw new Error("User has no RSA public key");
  }

  const key = new NodeRSA(rsaPrivateKey, "pkcs8-private");
  return key.sign(challenge, "base64");
}

async function getIpCount(userId: number, licenseId: number, ip: string) {
  const last12Hours = new Date(Date.now() - 1000 * 60 * 60 * 12);

  return prisma.log.count({
    where: {
      userId,
      licenseId: licenseId,
      ip,
      result: "VALID",
      timestamp: {
        gte: last12Hours,
      },
    },
  });
}

async function decrementValidationPoints(licenseId: number, amount = 1) {
  await prisma.license.update({
    where: {
      id: licenseId,
    },
    data: {
      validationPoints: {
        decrement: amount,
      },
    },
  });
}

type LicenseWithRsaKey = Prisma.LicenseGetPayload<{
  include: { user: { select: { rsaPrivateKey: true } } };
}>;

async function fetchLicense(
  licenseKey: string,
  userId: number,
  includePrivateKey: boolean
) {
  return prisma.license.findUnique({
    where: { userId_licenseKey: { licenseKey, userId } },
    include: includePrivateKey
      ? { user: { select: { rsaPrivateKey: true } } }
      : undefined,
  });
}

async function checkLicense(
  license: License,
  userId: number,
  ip: string,
  scope: string | undefined
): Promise<VerificationResultStatus> {
  if (scope && license.licenseScope !== scope) {
    return "LICENSE_SCOPE_FAILED";
  }

  if (license.expirationDate && license.expirationDate < new Date()) {
    return "EXPIRED";
  }

  if (license.validationPoints !== null && license.validationPoints <= 0) {
    return "RATE_LIMIT_EXCEEDED";
  }

  if (license.ipLimit !== null) {
    const ipCount = await getIpCount(userId, license.id, ip);
    if (ipCount >= license.ipLimit) {
      return "IP_LIMIT_EXCEEDED";
    }
  }

  return "VALID";
}

export async function verifyLicense(
  licenseKey: string,
  userId: number,
  ip: string,
  options: VerificationOptions
): Promise<VerificationResult> {
  let time = Date.now();

  const license = await fetchLicense(
    licenseKey,
    userId,
    options.challenge !== undefined
  );

  if (DEBUG_TIME) {
    console.log("Time to fetch license: ", Date.now() - time);
    time = Date.now();
  }

  if (!license) {
    return {
      result: "NOT_FOUND",
    };
  }

  const status = await checkLicense(license, userId, ip, options.scope);

  if (DEBUG_TIME) {
    console.log("Time to check license: ", Date.now() - time);
    time = Date.now();
  }

  const backgroundPromises: Promise<unknown>[] = [];

  // Create log entry
  backgroundPromises.push(
    prisma.log.create({
      data: {
        userId,
        licenseId: license.id,
        ip,
        result: status,
        metadata: options.metadata || "",
      },
    })
  );

  if (status != "VALID") {
    return {
      result: status,
    };
  }

  // Reduce validation points
  if (license.validationPoints !== null) {
    backgroundPromises.push(decrementValidationPoints(license.id));
  }

  // Sign challenge
  let signedChallenge: string | undefined = undefined;
  if (options.challenge) {
    signedChallenge = await signChallenge(
      options.challenge,
      (license as LicenseWithRsaKey).user.rsaPrivateKey
    );
  }

  await Promise.all(backgroundPromises);

  if (DEBUG_TIME) {
    console.log("Time to log, sign and decrement: ", Date.now() - time);
  }

  return {
    result: "VALID",
    signedChallenge,
  };
}
