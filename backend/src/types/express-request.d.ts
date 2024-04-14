// Type definitions to add userId to Express.Request:

declare namespace Express {
  export interface Request {
    userId?: number;
    user?: {
      id: number;
    };
  }
}
