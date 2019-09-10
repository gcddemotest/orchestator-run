import { provider, Scope } from "@msiviero/knit";
import * as pino from "pino";
import { Logger } from "pino";

@provider<Logger>("app:log", Scope.Singleton)
export class LoggerProvider {

  public provide = () => {
    return pino({
      prettyPrint: (process.env.NODE_ENV || "") === "production" ? false : { colorize: true },
      level: process.env.LOG_LEVEL || "info",
    });
  }
}
