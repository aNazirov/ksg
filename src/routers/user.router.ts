import { Router } from "express";
import { Modules } from "src/config";
import { Controllers } from "src/controllers";
import { SequelizeInstance } from "src/db";
import { Services } from "src/services";
import { container, Lifecycle } from "tsyringe";

const router = Router();

container.register(
  Modules.Sequelize,
  { useClass: SequelizeInstance },
  { lifecycle: Lifecycle.Singleton }
);
container.register(Modules.Services.User, { useClass: Services.User });
container.register(Modules.Controllers.User, { useClass: Controllers.User });

const controller = container.resolve<Controllers.User>(
  Modules.Controllers.User
);

router.patch("/:userId/balance", controller.updateBalance);
// router.patch("/:userId", controller.update);

export { router };
