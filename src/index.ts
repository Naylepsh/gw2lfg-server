import "reflect-metadata";
import "module-alias/register";
import "./data/repositories/user/user.repository";
import { loadDependencies } from "./loaders";
import { config } from "./config";

/*
The main file responsible for start up of the app
*/
const main = async () => {
  const { app } = await loadDependencies();

  const port = config.port;
  await app.listen(port);
  console.log(`server listening at port ${port}`);
};

main();
