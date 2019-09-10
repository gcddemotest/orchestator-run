
import { Container, HttpServer, injectable } from "@msiviero/knit";
import { RootEndpoint } from "./api/root";
import { GoogleApiProvider } from "./provider/googleapi-provider";

@injectable()
class Application {

  public run() {
    HttpServer
      .getInstance()
      .api(RootEndpoint)
      .registerProvider(GoogleApiProvider)
      .start({ port: this.getPort() });
  }

  private getPort() {
    return parseInt(process.env.PORT || "8080", 10);
  }
}

export const runner = () => {
  Container.getInstance().resolve(Application).run();
};
