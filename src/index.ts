import cluster from "node:cluster";
import * as os from "os";
import "reflect-metadata";
import { Sequelize } from "sequelize";
import { container } from "tsyringe";
import app from "./app";
import { AppConfig, Modules } from "./config";
import { SequelizeInstance } from "./db";
import { Utils } from "./utils";

const cleanup = async (sequelize: Sequelize) => {
  console.log("Cleaning up...");

  await sequelize.close();
  console.log("Database has been disconnected");

  console.log("Cleanup done");
};

const main = async () => {
  const numCPUs = os.cpus().length;

  console.log(numCPUs, process.env.UV_THREADPOOL_SIZE);

  if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) cluster.fork();

    cluster.on("exit", (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    const sequelize = container.resolve<SequelizeInstance>(Modules.Sequelize);

    console.log(`Checking database connection...`);

    await sequelize.client.authenticate();

    console.log("Database is connected");

    Utils.setupGracefulShutdown(() => cleanup(sequelize.client));

    await sequelize.client.sync();

    app.listen(AppConfig.PORT, () => {
      console.log(
        `🚀 Core server ready on dev mode at: ${os.hostname()}:${
          AppConfig.PORT
        }`
      );
    });
  }
};

main();
