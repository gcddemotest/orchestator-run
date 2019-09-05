import { injectable } from "@msiviero/knit";
import { google } from "googleapis";

@injectable()
export class RuntimeConfigService {

  public async getApplicationEndpoint() {
    const auth = await google.auth.getApplicationDefault();
    const response = await google.runtimeconfig({ version: "v1beta1" }).projects.configs.variables.get({
      name: "projects/gcd-jr-demo/configs/sample-config/variables/myconfig",
      auth: auth.credential,
    });

    return response.data.text;
  }
}
