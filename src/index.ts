import { loadTypeORM } from "./loaders/typeorm";
import { User } from "./models/user";

const main = async () => {
  await loadTypeORM();
  const user = User.create({ username: "john", password: "password" });
  console.log(user);
};

main();
