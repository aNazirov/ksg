import fs from "fs";
import path from "path";
import "reflect-metadata";
import { Database } from ".";

const client = new Database().client;

const init = async () => {
  const migrationsDir = path.join(process.cwd(), "migrations");

  await client.connect();
  console.log("Database is connected");

  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      version TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ DEFAULT now()
    );
  `);

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const version = path.basename(file);

    const { rows } = await client.query(
      "SELECT 1 FROM migrations WHERE version = $1;",
      [version]
    );

    if (rows.length > 0) {
      console.log(`Skipping ${version}`);
      continue;
    }

    console.log(`Applying ${version}`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");

    try {
      await client.query(sql);
      console.log(`✅ Applied ${version}`);

      await client.query(`INSERT INTO "users" ("balance") values ($1);`, [
        10000,
      ]);
    } catch (err) {
      console.error(`❌ Failed to apply ${version}`, err);
    }
  }

  await client.end();
  console.log("Database has been disconnected");
};

init();
