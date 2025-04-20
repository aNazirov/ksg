import { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }

  console.error("Error:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
}
