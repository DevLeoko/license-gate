import { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";
import { ShowError, ShowErrorType } from "./ShowError";

export interface ResponseError<T extends ShowErrorType> {
  error: T;
  /**
   * Additional details about the error.
   * @default {}
   */
  details: any;
}

export function tsoaErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (err instanceof ValidateError) {
    return res.status(422).json({
      error: "invalid-schema" satisfies ShowErrorType,
      details: err?.fields,
    });
  }

  if (err instanceof ShowError) {
    let statusCode =
      err.type === "not-found"
        ? 404
        : err.type === "invalid-schema"
        ? 422
        : err.type === "unauthorized"
        ? 401
        : err.type === "internal-server-error"
        ? 500
        : 400;

    return res.status(statusCode).json({
      error: err.type,
      details: err.message?.replace("+ ", ""),
    });
  }

  if (err instanceof Error) {
    console.error(err);
    return res.status(500).json({
      error: "internal-server-error" satisfies ShowErrorType,
      details: "Internal Server Error",
    });
  }

  next();
}
