import "reflect-metadata";
import request from "supertest";
import {
  Body,
  createExpressServer,
  Get,
  JsonController,
  Post,
  useContainer,
} from "routing-controllers";
import Container, { Service } from "typedi";

const resString = "Hello, world!";

interface User {
  username: string;
}

@Service()
class ResStringService {
  getHello() {
    return resString;
  }
}

@JsonController()
class SampleController {
  constructor(private readonly service: ResStringService) {}

  @Get("/test")
  testGet() {
    return this.service.getHello();
  }

  @Post("/test")
  testPost(@Body() user: any) {
    return user.username;
  }
}

Container.set(SampleController, new SampleController(new ResStringService()));
useContainer(Container);

describe("Routing Controllers integration tests", () => {
  it("should work", async () => {
    const app = createExpressServer({ controllers: [SampleController] });
    const result = await request(app).get("/test");

    expect(result.body).toBe(resString);
  });

  it("also should work", async () => {
    const app = createExpressServer({ controllers: [SampleController] });
    const user: User = { username: "username" };
    const result = await request(app).post("/test").send(user);

    expect(result.body).toBe(user.username);
  });
});
