import { License, Prisma } from "@prisma/client";
import NodeRSA from "node-rsa";
import { prisma } from "../prisma";

export interface VerificationOptions {
  scope?: string;
  challenge?: string;
  metadata?: string;
}

type VerificationResultStatus = Prisma.LogCreateInput["result"];

export interface VerificationResult {
  result: VerificationResultStatus;
  challengeResult?: string;
}

async function solveChallenge(
  challenge: string,
  userId: number
): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { rsaPrivateKey: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.rsaPrivateKey) {
    throw new Error("User has no RSA public key");
  }

  const key = new NodeRSA(user.rsaPrivateKey, "pkcs8-private");
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

async function fetchLicense(licenseKey: string, userId: number) {
  return prisma.license.findUnique({
    where: { userId_licenseKey: { licenseKey, userId } },
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
  options: VerificationOptions,
  metadata: string = ""
): Promise<VerificationResult> {
  // TODO: By writing raw SQL or batching them we could reduce the number of queries/requests
  // TODO: This is not save against timing attacks / could use a mutex in future
  const license = await fetchLicense(licenseKey, userId);

  if (!license) {
    return {
      result: "NOT_FOUND",
    };
  }

  const status = await checkLicense(license, userId, ip, options.scope);

  // Create log entry
  await prisma.log.create({
    data: {
      userId,
      licenseId: license.id,
      ip,
      result: status,
      metadata,
    },
  });

  if (status != "VALID") {
    return {
      result: status,
    };
  }

  // Reduce validation points
  if (license.validationPoints !== null) {
    await decrementValidationPoints(license.id);
  }

  // Solve challenge
  let challengeResult: string | undefined = undefined;
  if (options.challenge) {
    challengeResult = await solveChallenge(options.challenge, userId);
  }

  return {
    result: "VALID",
    challengeResult,
  };
}
