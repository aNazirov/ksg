import { Sequelize } from "sequelize";
import { AppConfig } from "src/config";
import { singleton } from "tsyringe";
import { Models } from "./models";

export type TypedSequelize = Sequelize & { models: { User: Models["User"] } };

@singleton()
export class SequelizeInstance {
  public client: TypedSequelize;

  constructor() {
    const sequelize = new Sequelize({
      dialect: "postgres",
      username: AppConfig.DATABASE.USER,
      password: AppConfig.DATABASE.PASSWORD,
      database: AppConfig.DATABASE.DB,
      host: AppConfig.DATABASE.HOST,
      port: AppConfig.DATABASE.PORT,
      logging: false,
    });

    this.client = sequelize as TypedSequelize;

    this.init();
    console.log(`SequelizeInstance has been initialized`);
  }

  private init() {
    Models.initUser(this.client);
  }
}
