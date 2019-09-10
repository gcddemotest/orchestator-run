import { api, Exchange, HttpMethod, route } from "@msiviero/knit";
import { DeploymentManagerService } from "../service/deployment-manager-service";
import { RuntimeConfigService } from "../service/runtimeconfig-service";

@api()
export class RootEndpoint {

  constructor(
    private readonly runtimeConfigService: RuntimeConfigService,
    private readonly deploymentManagerService: DeploymentManagerService,
  ) { }

  @route(HttpMethod.GET, "/")
  public async get(exchange: Exchange) {
    exchange.response.send("gcd demo orchestartor");
  }

  @route(HttpMethod.GET, "/sample")
  public async sampleConfig(exchange: Exchange) {
    try {
      const config = await Promise.all([
        this.runtimeConfigService.getApplicationEndpoint(),
        this.deploymentManagerService.getApplicationEndpoint(),
      ]);

      exchange.response.send(config);
    } catch (error) {
      exchange.response.code(500).send(error);
    }
  }
}
