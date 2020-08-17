import { Singleton, Inject } from "typescript-ioc";
import Tracer from "tracer";
import { ENV } from "./environment";

@Singleton
export class Logger {
  @Inject
  private readonly env: ENV;
  private readonly tracer: Tracer.Tracer.Logger = Tracer.colorConsole({ level: this.env.environments.LOG_LEVEL });
  public error: (...args: any) => Tracer.Tracer.LogOutput = this.tracer.error;
  public warn: (...args: any) => Tracer.Tracer.LogOutput = this.tracer.warn;
  public info: (...args: any) => Tracer.Tracer.LogOutput = this.tracer.info;
}
