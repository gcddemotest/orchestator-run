import { api, Exchange, HttpMethod, route } from "@msiviero/knit";
import { DeploymentManagerService } from "../service/deployment-manager-service";

@api("/deployments")
export class DeploymentsEndpoint {

  constructor(
    private readonly deploymentManager: DeploymentManagerService,
  ) { }

  @route(HttpMethod.POST)
  public async create(exchange: Exchange) {
    await this.deploymentManager.deploy();
    exchange.response.code(202).send();
  }

  @route(HttpMethod.DELETE)
  public async delete(exchange: Exchange) {
    await this.deploymentManager.destroy();
    exchange.response.code(202).send();
  }
}
