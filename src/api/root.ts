import { api, Exchange, HttpMethod, route } from "@msiviero/knit";
import { RuntimeConfigService } from "../service/runtimeconfig-service";

@api()
export class RootEndpoint {

  constructor(
    private readonly runtimeConfigService: RuntimeConfigService,
  ) { }

  @route(HttpMethod.GET, "/")
  public async get(exchange: Exchange) {
    exchange.response.send("gcd demo orchestartor");
  }

  @route(HttpMethod.GET, "/endpoint")
  public async sampleConfig(exchange: Exchange) {
    try {
      exchange.response.send(await this.runtimeConfigService.getApplicationEndpoint());
    } catch (error) {
      exchange.response.code(500).send(error);
    }
  }
}
