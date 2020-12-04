import "reflect-metadata";
import { createExpressServer, useContainer } from "routing-controllers";
import { controllers } from "./api/controllers";
import { CurrentUserJWTMiddleware } from "./api/middleware/current-user.middleware";
import "./data/repositories/user/user.repository";
import { loadTypeDI } from "./loaders/typedi";
import { userRepositoryType } from "./loaders/typedi.constants";
import { loadTypeORM } from "./loaders/typeorm";

const main = async () => {
  await loadTypeORM();

  const container = loadTypeDI();
  useContainer(container);

  const currentUserMiddleware = new CurrentUserJWTMiddleware(
    container.get(userRepositoryType)
  );

  const app = createExpressServer({
    controllers,
    currentUserChecker: currentUserMiddleware.getCurrentUser.bind(
      currentUserMiddleware
    ),
  });

  const port = 3000;
  await app.listen(port);
  console.log(`server listening at port ${port}`);
};

main();
