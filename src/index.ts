import { loadTypeORM } from "./loaders/typeorm";

const main = async () => {
  await loadTypeORM();
};

main();
