import { FindUserRaidPostsController } from "./find-user-raid-posts.controller";
import { FindUserController } from "./find-user.controller";
import { LoginUserController } from "./login.controller";
import { MeController } from "./me.controller";
import { RegisterUserController } from "./register.controller";

// Available users controllers
export const usersControllers = [
  LoginUserController,
  RegisterUserController,
  MeController,
  FindUserController,
  FindUserRaidPostsController,
];
