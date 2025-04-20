import { config } from "dotenv";
import { Types } from "src/types";

config();

const DATABASE = {
  PASSWORD: process.env.POSTGRES_PASSWORD!,
  USER: process.env.POSTGRES_USER!,
  DB: process.env.POSTGRES_DB!,
  HOST: process.env.POSTGRES_HOST!,
  PORT: Number(process.env.POSTGRES_PORT ?? 5432),
};

export const AppConfig: Types.AppConfig = {
  DATABASE,
  PORT: Number(process.env.PORT ?? 4000),
};

export const Modules = {
  Sequelize: Symbol("SequelizeInstance"),
  Services: { User: Symbol("Services.User") },
  Controllers: { User: Symbol("Controllers.User") },
} as const;
