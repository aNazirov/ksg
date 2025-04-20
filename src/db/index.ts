import Pg, { Client } from "pg";
import { AppConfig } from "src/config";
import { singleton } from "tsyringe";

@singleton()
export class Database {
  public client: Pg.Client;

  constructor() {
    const client = new Client({
      user: AppConfig.DATABASE.USER,
      password: AppConfig.DATABASE.PASSWORD,
      database: AppConfig.DATABASE.DB,
      host: AppConfig.DATABASE.HOST,
      port: AppConfig.DATABASE.PORT,
    });

    this.client = client;

    console.log(`Database has been initialized`);
  }
}
