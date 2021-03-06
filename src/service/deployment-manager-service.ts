import { HttpError, inject, injectable } from "@msiviero/knit";
import { readFile } from "fs";
import { Logger } from "pino";
import { GoogleApiClient } from "../provider/googleapi-provider";

export interface Operation {
  startTime: string;
  insertTime: string;
  status: string; // "RUNNING" | "DONE";
  operationType: string; // insert" | "delete";
}

@injectable()
export class DeploymentManagerService {

  constructor(
    @inject("google:client") private readonly googleApiClient: Promise<GoogleApiClient>,
    @inject("app:log") private log: Logger,
  ) { }

  public async deploy() {

    this.log.info("Starting deployment");

    try {
      const google = await this.googleApiClient;
      return google
        .client
        .deploymentmanager("v2beta")
        .deployments
        .insert({
          project: google.projectId,
          requestBody: {
            name: "managed-by-orchestator",
            target: {
              config: await this.importConfig("infrastructure.yaml", "infrastructure.yaml"),
              imports: [
                await this.importConfig("tpl/docker-vm-pool.jinja", "tpl/docker-vm-pool.jinja"),
                await this.importConfig("tpl/instance.jinja", "tpl/instance.jinja"),
                await this.importConfig("cloudsql-proxy.sh", "scripts/cloudsql-proxy.sh"),
                await this.importConfig("blackbox-vm.sh", "scripts/blackbox-vm.sh"),
              ],
            },
          },
        });
    } catch (error) {
      this.log.error("Error while creating deployment", error);
      throw error;
    }
  }

  public async destroy() {
    this.log.info("Destroying deployment");
    try {
      const google = await this.googleApiClient;
      return google
        .client
        .deploymentmanager("v2beta")
        .deployments
        .delete({
          project: google.projectId,
          deployment: "managed-by-orchestator",
        });
    } catch (error) {
      this.log.error("Error while destroying deployment", error);
      throw error;
    }
  }


  public async get(): Promise<Readonly<Partial<Operation>>> {

    try {
      const google = await this.googleApiClient;
      const response = await google
        .client
        .deploymentmanager("v2beta")
        .deployments
        .get({
          project: google.projectId,
          deployment: "managed-by-orchestator",
        });

      const operation = response.data.operation;

      if (operation) {
        const {
          startTime,
          insertTime,
          status,
          operationType,
        } = operation;

        return { startTime, insertTime, status, operationType };
      } else {
        throw new HttpError(404, "No operation pending");
      }
    } catch (error) {
      this.log.error("Error while getting deployment state", error);
      throw error;
    }
  }

  private importConfig = async (name: string, filePath: string) => ({
    name,
    content: await this.readFile(`deployment-scripts/${filePath}`),
  })

  private readFile = (filePath: string) => new Promise<string>((resolve, reject) => {
    readFile(filePath, (error: NodeJS.ErrnoException | null, content: Buffer) => {
      if (error) {
        return reject(error);
      }
      resolve(content.toString("utf8"));
    });
  })
}
