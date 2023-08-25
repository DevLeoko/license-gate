import { Express, NextFunction, Request, Response } from "express";

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export async function setupNonTrpcRoutes(app: Express) {
  // TODO
}
