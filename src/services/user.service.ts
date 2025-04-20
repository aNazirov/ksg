import { Op, WhereOptions } from "sequelize";
import { Modules } from "src/config";
import { SequelizeInstance } from "src/db";
import { Utils } from "src/utils";
import { inject, injectable } from "tsyringe";

@injectable()
export class User {
  constructor(
    @inject(Modules.Sequelize) private readonly sequelize: SequelizeInstance
  ) {
    console.log(`User service has been initialized`);
  }

  // *Work
  async updateBalance(id: number, amount: number) {
    const user = await this.sequelize.client.models.User.findByPk(id);

    if (!user) {
      throw new Utils.CustomError("User not found", 404);
    }

    if (amount < 0 && user.balance < Math.abs(amount)) {
      throw new Utils.CustomError("User balance cannot be negative", 400);
    }

    const where: WhereOptions<{ id: number; balance: number }> = {
      id: user.id,
    };

    if (amount < 0) {
      where.balance = { [Op.gte]: Math.abs(amount) };
    }

    const [[affectedRows]] = await this.sequelize.client.models.User.increment(
      "balance",
      {
        by: amount,
        where: where,
      }
    );

    const updatedUser = (
      affectedRows as unknown as Array<typeof affectedRows>
    )[0];

    if (amount < 0 && !updatedUser) {
      throw new Utils.CustomError("User balance cannot be negative", 400);
    }

    return updatedUser;
  }

  // *Work
  // async updateBalance(id: number, amount: number) {
  //   const transaction = await this.sequelize.client.transaction({
  //     isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  //   });

  //   const user = await this.sequelize.client.models.User.findByPk(id, {
  //     transaction,
  //   });

  //   if (!user) {
  //     await transaction.rollback();
  //     throw new Utils.CustomError("User not found", 404);
  //   }

  //   if (amount < 0 && user.balance < Math.abs(amount)) {
  //     await transaction.rollback();
  //     throw new Utils.CustomError("User balance cannot be negative", 400);
  //   }

  //   const where: WhereOptions<{ id: number; balance: number }> = {};

  //   if (amount < 0) {
  //     where.balance = { [Op.gte]: Math.abs(amount) };
  //   }

  //   const [[affectedRows]] = await this.sequelize.client.models.User.increment(
  //     "balance",
  //     {
  //       by: amount,
  //       transaction,
  //       where: where,
  //     }
  //   );

  //   const updatedUser = (
  //     affectedRows as unknown as Array<typeof affectedRows>
  //   )[0];

  //   if (amount < 0 && !updatedUser) {
  //     await transaction.rollback();
  //     throw new Utils.CustomError("User balance cannot be negative", 400);
  //   }

  //   await transaction.commit();

  //   return updatedUser;
  // }

  // *Work
  // async updateBalance(id: number, amount: number) {
  //   const user = await this.sequelize.client.models.User.findByPk(id);

  //   if (!user) {
  //     throw new Utils.CustomError("User not found", 404);
  //   }

  //   const [updatedUser] = await this.sequelize.client.query<{
  //     id: number;
  //     balance: number;
  //   }>(
  //     `
  //     UPDATE users
  //     SET balance = balance + :amount
  //     WHERE id = :id AND balance + :amount >= 0
  //     RETURNING *;
  //     `,
  //     {
  //       replacements: { id, amount },
  //       type: QueryTypes.SELECT,
  //     }
  //   );

  //   if (!updatedUser) {
  //     throw new Utils.CustomError("User balance cannot be negative", 400);
  //   }

  //   return updatedUser;
  // }
}
