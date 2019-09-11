
import { Container, HttpServer, inject, injectable, env } from "@msiviero/knit";
import { Logger } from "pino";
import { DeploymentsEndpoint } from "./api/deployments";
import { RootEndpoint } from "./api/root";
import { GoogleApiProvider } from "./provider/googleapi-provider";
import { LoggerProvider } from "./provider/logger-provider";

@injectable()
class Application {

  constructor(
    @env("PORT", "8080") private port: string,
    @inject("app:log") private log: Logger,
  ) { }

  public run() {

    const port = parseInt(this.port, 10);

    HttpServer
      .getInstance()
      .api(RootEndpoint)
      .api(DeploymentsEndpoint)
      .registerProvider(GoogleApiProvider)
      .registerProvider(LoggerProvider)
      .start({ port })
      .then(() => this.log.info(`Server started on port ${port}`));
  }
}

export const runner = () => {
  Container.getInstance().resolve(Application).run();
};
