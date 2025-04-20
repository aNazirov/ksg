import { config } from "dotenv";
import { Types } from "src/types";

config();

const REDIS = {
  PASSWORD: process.env.REDIS_PASSWORD!,
  USERNAME: process.env.REDIS_USERNAME!,
  DB: Number(process.env.REDIS_DB) ?? 0,
  HOST: process.env.REDIS_HOST!,
  PORT: Number(process.env.REDIS_PORT ?? 5432),
};

const DATABASE = {
  PASSWORD: process.env.POSTGRES_PASSWORD!,
  USER: process.env.POSTGRES_USER!,
  DB: process.env.POSTGRES_DB!,
  HOST: process.env.POSTGRES_HOST!,
  PORT: Number(process.env.POSTGRES_PORT ?? 5432),
};

export const AppConfig: Types.AppConfig = {
  REDIS,
  DATABASE,
  PORT: Number(process.env.PORT ?? 4000),
};

export const Modules = {
  Redis: Symbol("Redis"),
  Database: Symbol("Database"),
  Services: { User: Symbol("Services.User"), Item: Symbol("Services.Item") },
  Controllers: {
    User: Symbol("Controllers.User"),
    Item: Symbol("Controllers.Item"),
  },
} as const;
