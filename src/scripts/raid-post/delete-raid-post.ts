import "module-alias/register"; // needed for usage of module aliases
import { loadTypeDI } from "../../loaders/typedi.loader";
import { loadTypeORM } from "../../loaders/typeorm.loader";
import Container from "typedi";
import { DeleteRaidPostService } from "../../services/raid-post/delete-raid-post.service";
import { loadEnv } from "../common/load-env";

const main = async () => {
  loadEnv();

  if (process.argv.length > 3) {
    console.log(
      "Missing id argument.\nSample API usage: yarn cli:raid-post:delete 42"
    );
    return;
  }

  const id = parseInt(process.argv[2]);
  if (Number.isNaN(id)) {
    console.log("Invalid argument type. Id should be an integer");
    return;
  }

  const conn = await loadTypeORM();
  loadTypeDI();

  try {
    const service = Container.get(DeleteRaidPostService);
    await service.delete({ id });
    console.log(`Successfully deleted raid post with id ${id}`);
  } catch (error) {
    throw error;
  } finally {
    await conn.close();
  }
};

main();
