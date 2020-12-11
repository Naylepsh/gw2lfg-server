import "reflect-metadata";
import "./data/repositories/user/user.repository";
import { loadDependencies } from "./loaders";
import { config } from "./config";

const main = async () => {
  const { app } = await loadDependencies();

  const port = config.port;
  await app.listen(port);
  console.log(`server listening at port ${port}`);
};

main();
