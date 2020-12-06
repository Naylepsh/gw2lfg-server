import { useContainer } from "routing-controllers";
import { loadTypeDI } from "./typedi.loader";
import { loadTypeORM } from "./typeorm.loader";
import { loadServer } from "./server.loader";

export async function loadDependencies() {
  await loadTypeORM();

  const container = loadTypeDI();
  useContainer(container);

  const app = loadServer(container);
  return { app, container };
}
