import { NextFunction, Request, Response } from "express";

export function logRequestTime(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();

  res.on("finish", () => {
    const end = Date.now();
    const duration = end - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${
        res.statusCode
      } | ${duration}ms`
    );
  });

  next();
}
