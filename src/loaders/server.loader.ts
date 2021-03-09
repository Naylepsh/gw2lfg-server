import { createExpressServer } from "routing-controllers";
import cors from "cors";
import Container from "typedi";
import { controllers } from "../api/controllers";
import { CurrentUserJWTMiddleware } from "../api/middleware/current-user.middleware";
import { userRepositoryType } from "./typedi.constants";

/**
 * Loads Express.js server
 */
export const loadServer = () => {
  const currentUserMiddleware = new CurrentUserJWTMiddleware(
    Container.get(userRepositoryType)
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
