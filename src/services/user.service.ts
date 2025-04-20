import { Modules } from "src/config";
import { Database } from "src/db";
import { Models } from "src/db/models";
import { Utils } from "src/utils";
import { inject, injectable } from "tsyringe";

@injectable()
export class User {
  constructor(@inject(Modules.Database) private readonly database: Database) {
    console.log(`User service has been initialized`);
  }
  async updateBalance(id: number, amount: number) {
    const candidateQuery = await this.database.client.query<Models["User"]>(
      `SELECT * FROM "users" WHERE "id" = $1;`,
      [id]
    );

    const [candidate] = candidateQuery.rows;

    if (!candidate) {
      throw new Utils.CustomError("User not found", 404);
    }

    const updateQuery = await this.database.client.query<Models["User"]>(
      `
      UPDATE users
      SET balance = balance + $2
      WHERE id = $1 AND balance + $2 >= 0
      RETURNING *;
      `,
      [id, amount]
    );

    const [updatedUser] = updateQuery.rows;

    if (!updatedUser) {
      throw new Utils.CustomError("User balance cannot be negative", 400);
    }

    return updatedUser;
  }
}
