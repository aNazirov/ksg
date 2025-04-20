import { Router } from "express";
import { Modules } from "src/config";
import { Controllers } from "src/controllers";
import { Libs } from "src/libs";
import { Services } from "src/services";
import { Utils } from "src/utils";
import { container } from "tsyringe";

const router = Router();

container.register(Modules.Redis, { useClass: Libs.Redis });
container.register(Modules.Services.Item, { useClass: Services.Item });
container.register(Modules.Controllers.Item, { useClass: Controllers.Item });

const controller = container.resolve<Controllers.Item>(
  Modules.Controllers.Item
);

router.get("/", Utils.cache(60 * 5), controller.getMany);

export { router };
