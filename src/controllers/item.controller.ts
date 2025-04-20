import { Request, Response } from "express";
import { Modules } from "src/config";
import { Services } from "src/services";
import { Utils } from "src/utils";
import { inject, injectable } from "tsyringe";

@injectable()
export class Item {
  constructor(
    @inject(Modules.Services.Item) private readonly service: Services.Item
  ) {
    console.log(`Item controller has been initialized`);

    this.getMany = this.getMany.bind(this);
  }

  async getMany(req: Request, res: Response) {
    try {
      const items = await this.service.getMany();

      res.status(200).json({ data: items });
    } catch (error) {
      return Utils.customErrorHandler(res, error as Utils.CustomError);
    }
  }
}
