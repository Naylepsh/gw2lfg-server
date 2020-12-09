import "reflect-metadata";
import "./data/repositories/user/user.repository";
import { loadDependencies } from "./loaders";

const main = async () => {
  const { app } = await loadDependencies();

  const port = 3000;
  await app.listen(port);
  console.log(`server listening at port ${port}`);
};

main();
