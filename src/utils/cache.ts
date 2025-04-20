import { NextFunction, Request, Response } from "express";
import { Modules } from "src/config";
import { Libs } from "src/libs";
import { container } from "tsyringe";

export function cache(ttl = 60) {
  const redis = container.resolve<Libs.Redis>(Modules.Redis).client;

  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `cache:${req.originalUrl}`;
    const cached = await redis.get(key);

    if (cached) {
      res.json(JSON.parse(cached));

      return;
    }

    const originalJson = res.json.bind(res);

    res.json = (body) => {
      redis.set(key, JSON.stringify(body), "EX", ttl);
      return originalJson(body);
    };

    next();
  };
}
