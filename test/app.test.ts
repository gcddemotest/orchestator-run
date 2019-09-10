import { Container, HttpServer, Provider, Scope } from "@msiviero/knit";
import * as supertest from "supertest";
import { Mock } from "typemoq";
import { RootEndpoint } from "../src/api/root";
import { RuntimeConfigService } from "../src/service/runtimeconfig-service";

describe("Http server custom instance", () => {

  const mockRuntimeConfig = Mock.ofType(RuntimeConfigService);

  mockRuntimeConfig
    .setup((instance) => instance.getApplicationEndpoint())
    .returns(() => Promise.resolve({ configs: [] }));

  const container = new Container()
    .register(RootEndpoint, Scope.Singleton)
    .registerTokenProvider(RuntimeConfigService, class implements Provider<RuntimeConfigService> {
      public provide = () => mockRuntimeConfig.object;
    });

  const httpServer = new HttpServer(container)
    .api(RootEndpoint);

  beforeAll(() => httpServer.start({ port: 0 }));
  afterAll(() => httpServer.stop());

  it("should register endpoint and serve requests", async () => {

    const response = await supertest(httpServer.getServer())
      .get("/")
      .expect(200)
      .expect("Content-Type", "text/plain; charset=utf-8");

    expect(response.text).toEqual("gcd demo orchestartor");
  });

  it("should use runtimeconfig to fetch configs", async () => {

    const response = await supertest(httpServer.getServer())
      .get("/sample")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");

    expect(response.text).toEqual("[]");
  });
});
