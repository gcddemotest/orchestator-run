
import { Container, HttpServer, inject, injectable } from "@msiviero/knit";
import { Logger } from "pino";
import { RootEndpoint } from "./api/root";
import { GoogleApiProvider } from "./provider/googleapi-provider";
import { LoggerProvider } from "./provider/logger-provider";

@injectable()
class Application {

  constructor(
    @inject("app:log") private log: Logger,
  ) { }

  public run() {
    HttpServer
      .getInstance()
      .api(RootEndpoint)
      .registerProvider(GoogleApiProvider)
      .registerProvider(LoggerProvider)
      .start({ port: this.getPort() })
      .then(() => this.log.info(`Server started on port ${this.getPort()}`));
  }

  private getPort() {
    return parseInt(process.env.PORT || "8080", 10);
  }
}

export const runner = () => {
  Container.getInstance().resolve(Application).run();
};
