import { createExpressServer } from "routing-controllers";
import cors from "cors";
import Container from "typedi";
import { controllers } from "../api/controllers";
import { CurrentUserJWTMiddleware } from "../api/middleware/current-user.middleware";
import { userRepositoryType } from "./typedi.constants";

export const loadServer = (container: typeof Container) => {
  const currentUserMiddleware = new CurrentUserJWTMiddleware(
    container.get(userRepositoryType)
  );

  const app = createExpressServer({
    cors: true,
    controllers,
    currentUserChecker: currentUserMiddleware.getCurrentUser.bind(
      currentUserMiddleware
    ),
    middlewares: [cors()],
  });

  return app;
};
