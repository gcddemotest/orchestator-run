import { provider, Scope } from "@msiviero/knit/dist/dependency-injection";
import { google, GoogleApis } from "googleapis";

export interface GoogleApiClient {
  client: GoogleApis;
  projectId: string;
}

@provider<Promise<GoogleApiClient>>("google:client", Scope.Singleton)
export class GoogleApiProvider {
  public provide = () => new Promise<GoogleApiClient>(async (resolve, reject) => {
    const auth = new google.auth.GoogleAuth({
      scopes: [
        "https://www.googleapis.com/auth/cloud-platform",
        "https://www.googleapis.com/auth/cloudruntimeconfig",
      ],
    });
    try {
      google.options({ auth: await auth.getClient() });
      resolve({ client: google, projectId: await auth.getProjectId() });
    } catch (error) {
      reject(error);
    }
  })
}
