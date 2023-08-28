import { Express, NextFunction, Request, Response } from "express";
import { handleLicenseKeyVerification } from "./verify";

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export async function setupNonTrpcRoutes(app: Express) {
  app.get(
    `/license/:userId/:licenseKey/verify`,
    asyncHandler(handleLicenseKeyVerification)
  );
  app.post(
    `/license/:userId/:licenseKey/verify`,
    asyncHandler(handleLicenseKeyVerification)
  );
}
