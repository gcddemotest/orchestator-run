import { inject, injectable } from "@msiviero/knit";
import { GoogleApiClient } from "../provider/googleapi-provider";

@injectable()
export class DeploymentManagerService {

  constructor(
    @inject("google:client") private readonly googleApiClient: Promise<GoogleApiClient>,
  ) { }

  public async getApplicationEndpoint() {

    const google = await this.googleApiClient;
    const response = await google.client.deploymentmanager("v2beta").deployments.list({
      project: google.projectId,
    });

    return response.data;
  }
}
