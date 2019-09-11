import { env, provider, Scope } from "@msiviero/knit";
import * as pino from "pino";
import { Logger } from "pino";

@provider<Logger>("app:log", Scope.Singleton)
export class LoggerProvider {

  constructor(
    @env("LOG_LEVEL", "info") private readonly logLevel: string,
  ) { }

  public provide = () => pino({
    prettyPrint: { colorize: true },
    level: this.logLevel,
  })
}
