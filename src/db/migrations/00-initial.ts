import { QueryInterface } from "sequelize";

export async function up({
  context: queryInterface,
}: {
  context: QueryInterface;
}) {
  await queryInterface.createTable("users", {
    id: {
      type: "INTEGER",
      primaryKey: true,
      autoIncrement: true,
    },
    balance: {
      type: "DECIMAL",
    },
  });
}

export async function down({
  context: queryInterface,
}: {
  context: QueryInterface;
}) {
  await queryInterface.dropTable("users");
}
