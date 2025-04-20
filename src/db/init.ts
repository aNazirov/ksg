import "reflect-metadata";
import { QueryTypes } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";
import { SequelizeInstance } from ".";

const sequelize = new SequelizeInstance().client;

const umzug = new Umzug({
  migrations: { glob: "dist/db/migrations/*.js" },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

const init = async () => {
  await sequelize.authenticate();
  console.log("Database is connected");

  await umzug.up();

  await sequelize.query(`INSERT INTO "users" ("balance") values (:balance);`, {
    replacements: { balance: 10000 },
    type: QueryTypes.UPDATE,
  });

  await sequelize.close();
  console.log("Database has been disconnected");
};

init();
