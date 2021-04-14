import { useContainer } from "routing-controllers";
import { loadTypeDI } from "./typedi.loader";
import { loadTypeORM } from "./typeorm.loader";
import { loadServer } from "./server.loader";
import Container from "typedi";
import { loadTasks } from "./task.loader";

/**
 * Loads orm, dependency injection service and the server
 */
export async function loadDependencies() {
  const conn = await loadTypeORM();

  loadTypeDI();

  // allow routing-controllers the usage of the TypeDI Container
  useContainer(Container);

  loadTasks();

  const app = loadServer();
  return { app, conn };
}
