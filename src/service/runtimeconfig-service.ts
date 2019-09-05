import { injectable } from "@msiviero/knit";
import { google } from "googleapis";

@injectable()
export class RuntimeConfigService {

  public async getApplicationEndpoint() {

    const auth = new google.auth.GoogleAuth({
      scopes: [
        "https://www.googleapis.com/auth/cloud-platform",
        "https://www.googleapis.com/auth/cloudruntimeconfig",
      ],
    });

    google.options({
      auth: await auth.getClient(),
    });

    const projectId = await auth.getProjectId();

    const response = await google.runtimeconfig("v1beta1").projects.configs.list({
      parent: `projects/${projectId}`,
    });

    const response2 = await google.deploymentmanager("v2beta").deployments.list({
      project: projectId,
    });

    return [response.data, response2.data];
  }
}
