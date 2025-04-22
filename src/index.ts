import cluster from "node:cluster";
import * as os from "os";
import Pg from "pg";
import "reflect-metadata";
import { container } from "tsyringe";
import app from "./app";
import { AppConfig, Modules } from "./config";
import { Database } from "./db";
import { Utils } from "./utils";

const cleanup = async (client: Pg.Client) => {
  console.log("Cleaning up...");

  await client.end();
  console.log("Database has been disconnected");

  console.log("Cleanup done");
};

const main = async () => {
  const database = container.resolve<Database>(Modules.Database);

  console.log(`Checking database connection...`);

  await database.client.connect();

  console.log("Database is connected");

  Utils.setupGracefulShutdown(() => cleanup(database.client));

  app.listen(AppConfig.PORT, () => {
    console.log(
      `🚀 Core server ready on dev mode at: ${os.hostname()}:${AppConfig.PORT}`
    );
  });

  return;

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
    const database = container.resolve<Database>(Modules.Database);

    console.log(`Checking database connection...`);

    await database.client.connect();

    console.log("Database is connected");

    Utils.setupGracefulShutdown(() => cleanup(database.client));

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
