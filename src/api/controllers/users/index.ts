import { LoginUserController } from "./login.controller";
import { MeController } from "./me.controller";
import { RegisterUserController } from "./register.controller";

export const usersControllers = [
  LoginUserController,
  RegisterUserController,
  MeController,
];
