// import { loadTypeORM } from "./loaders/typeorm";
import "reflect-metadata";
import {
  Body,
  Post,
  createExpressServer,
  JsonController,
} from "routing-controllers";

@JsonController()
class SampleController {
  @Post("/test")
  testPost(@Body() user: any) {
    console.log({ user });
    return user;
  }
}

const main = async () => {
  // await loadTypeORM();
  const app = createExpressServer({ controllers: [SampleController] });
  app.listen(3000);
};

main();
