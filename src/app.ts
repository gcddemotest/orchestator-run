
import { Container, HttpServer, injectable } from "@msiviero/knit";
import { RootEndpoint } from "./api/root";

@injectable()
class Application {

  public run() {
    HttpServer
      .getInstance()
      .api(RootEndpoint)
      .start({ port: this.getPort() });
  }

  private getPort() {
    return parseInt(process.env.PORT || "8080", 10);
  }
}

export const runner = () => {
  Container.getInstance().resolve(Application).run();
};
