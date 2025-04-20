import { Request, Response } from "express";
import { Modules } from "src/config";
import { Services } from "src/services";
import { Types } from "src/types";
import { Utils } from "src/utils";
import { inject, injectable } from "tsyringe";

@injectable()
export class User {
  constructor(
    @inject(Modules.Services.User) private readonly service: Services.User
  ) {
    console.log(`User controller has been initialized`);

    this.updateBalance = this.updateBalance.bind(this);
  }

  async updateBalance(
    req: Request<
      {
        userId: string;
      },
      Types.UpdateUserBody,
      any,
      any,
      Record<string, any>
    >,
    res: Response
  ) {
    const userId = Number(req.params.userId);

    if (Number.isNaN(userId)) {
      return Utils.customErrorHandler(
        res,
        new Utils.CustomError("userId should be string number", 400)
      );
    }

    const amount = Number(req.body.amount);

    if (Number.isNaN(amount) || amount === 0) {
      return Utils.customErrorHandler(
        res,
        new Utils.CustomError("Amount should be non zero string number", 400)
      );
    }

    try {
      const user = await this.service.updateBalance(userId, amount);

      res.status(200).json({ message: "Balance has been updated" });
    } catch (error) {
      return Utils.customErrorHandler(res, error as Utils.CustomError);
    }
  }
}
