import { NextFunction, Request, Response } from "express";
import { CustomError } from "./custom-error";

export function errorHandler(
  error: Error & { status: number },
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(error);
  }

  res
    .status(error.status || 500)
    .json({ message: error.message || "Internal server error" });
}

export const logErrors = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error.stack);
  next(error);
};

export const customErrorHandler = (
  res: Response,
  error: Error | CustomError
) => {
  if (error instanceof CustomError) {
    res.status(error.code).json({
      status: "error",
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
