import { FindUserRaidPostsController } from "./find-user-raid-posts.controller";
import { FindUserItemsController } from "./find-user-items.controller";
import { FindUserController } from "./find-user.controller";
import { LoginUserController } from "./login.controller";
import { MeController } from "./me.controller";
import { RegisterUserController } from "./register.controller";
import { FindUserRaidClearStatusController } from "./find-user-raid-clear-status.controller";

// Available users controllers
export const usersControllers = [
  LoginUserController,
  RegisterUserController,
  MeController,
  FindUserController,
  FindUserRaidPostsController,
  FindUserItemsController,
  FindUserRaidClearStatusController,
];
