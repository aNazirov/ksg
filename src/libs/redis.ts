import Redis from "ioredis";
import { AppConfig } from "src/config";
import { singleton } from "tsyringe";

@singleton()
export class Client {
  readonly client: Redis;

  constructor() {
    const redis = new Redis({
      port: AppConfig.REDIS.PORT, // Redis port
      host: AppConfig.REDIS.HOST, // Redis host
      username: AppConfig.REDIS.USERNAME, // needs Redis >= 6
      password: AppConfig.REDIS.PASSWORD,
      db: AppConfig.REDIS.DB, // Defaults to 0
    });

    this.client = redis;
  }
}
