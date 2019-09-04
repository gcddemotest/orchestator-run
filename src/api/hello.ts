import { api, Exchange, HttpMethod, route } from "@msiviero/knit";
import { google } from "googleapis";
import { Service } from "../service/service";

@api()
export class Hello {

  constructor(
    private readonly service: Service,
  ) { }

  @route(HttpMethod.GET, "/hello")
  public async getEndpoint(exchange: Exchange) {
    exchange.response.send({ hello: this.service.name() });
  }

  @route(HttpMethod.GET, "/sample")
  public async get(exchange: Exchange) {

    const list = await google.runtimeconfig({ version: "v1beta1" }).projects.configs.list();

    exchange.response.send(list.data);
  }
}
