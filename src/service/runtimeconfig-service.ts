import { HttpError, inject, injectable } from "@msiviero/knit";
import { GoogleApiClient } from "../provider/googleapi-provider";

@injectable()
export class RuntimeConfigService {

  constructor(
    @inject("google:client") private readonly googleApiClient: Promise<GoogleApiClient>,
  ) { }

  public async getApplicationEndpoint() {

    const google = await this.googleApiClient;
    const response = await google
      .client
      .runtimeconfig("v1beta1")
      .projects
      .configs
      .variables
      .get({
        name: `projects/${google.projectId}/configs/infrastructure/variables/entrypoint-address`,
      });

    const value = response.data.text;

    if (!value) {
      throw new HttpError(404, "Entrypoint address not found. The infrastructure is deployed?");
    }
    return value;
  }
}
