import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../prisma";
import { ResponseError } from "../../utils/tsoa-response-error";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes: string[] | undefined,
  response: Response
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
      response
        .status(401)
        .send({
          error: "unauthorized",
          details: "Invalid API key",
        } satisfies ResponseError<"unauthorized">);
      return Promise.reject({});
    }
  }
}
