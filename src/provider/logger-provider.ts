import { env, provider, Scope } from "@msiviero/knit";
import * as pino from "pino";
import { Logger } from "pino";

@provider<Logger>("app:log", Scope.Singleton)
export class LoggerProvider {

  constructor(
    @env("LOG_LEVEL", "info") private readonly logLevel: string,
    @env("NODE_ENV", "development") private readonly nodeEnv: string,
  ) { }

  public provide = () => {

    console.log("blabal", this.logLevel);

    return pino({
      prettyPrint: this.nodeEnv ? false : { colorize: true },
      level: this.logLevel,
    });
  }
}
