import { Request } from "express";
import { z } from "zod";
import { prisma } from "../../prisma";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
) {
  if (securityName === "api_key") {
    // Get API key from request
    const apiKeyStr = request.headers.authorization || request.query["api_key"];

    const apiKeyParsed = z.string().parse(apiKeyStr);
    const apiKey = await prisma.apiKey.findUnique({
      where: { key: apiKeyParsed },
      select: { userId: true },
    });

    // Check if the API key is valid
    if (apiKey) {
      return Promise.resolve({
        id: apiKey.userId,
      });
    } else {
      return Promise.reject({});
    }
  }
}
