import { IEnvironment } from "../../types/iEnvironment";
import { Singleton } from "typescript-ioc";
@Singleton
export class ENV {
  public readonly environments: IEnvironment;
  public constructor() {
    this.environments = {
      NODE_ENV: this.Setter("NODE_ENV", "string", "product"),
      SENTRY_DSN: this.Setter("SENTRY_DSN", "string", ""),
      LOG_LEVEL: this.Setter("LOG_LEVEL", "string"),
      EXPRESS_HOST: this.Setter("EXPRESS_HOST", "string"),
      EXPRESS_PORT: parseInt(this.Setter("EXPRESS_PORT", "number"), 10),

      DATABASE_MONGODB_SESSION_HOST: this.Setter("DATABASE_MONGODB_SESSION_HOST", "string"),
      DATABASE_MONGODB_VIEDO_HOST: this.Setter("DATABASE_MONGODB_VIEDO_HOST", "string"),

      ZIXO_WALLET_ADDRESS: this.Setter("ZIXO_WALLET_ADDRESS", "string"),
      ZIXO_TOKEN: this.Setter("ZIXO_TOKEN", "string"),

      NETWORK: this.Setter("NETWORK", "string"),

      APP_MAX_DISTANCE: parseInt(this.Setter("APP_MAX_DISTANCE", "number"), 10),
    };

  }

  public Setter(envParam: string, type: string, defaultValue?: string): string {
    let value: string | undefined = process.env[envParam];
    if (value === undefined && defaultValue !== undefined) {
      value = defaultValue;
    }
    if (["number"].indexOf(type) > -1) {
      if (value === undefined || isNaN(parseFloat(value))) {
        throw new Error(`${envParam} => Not value[${value}] in type[${type}]`);
      }

      return value;
    }

    if (["string"].indexOf(type) > -1) {
      if (value === undefined) {
        throw new Error(`${envParam} => Not value[${value}] in type[${type}]`);
      }

      return value;
    }

    return "";
  }
  public keyValueFromString(s: string, delimiter: string, equal: string, convertTo: "float" | "int" | "string"): { [key: string]: number | string } {
    const kv: { [key: string]: number | string } = {};
    s.split(delimiter)
      .forEach((part: string) => {
        const [key, value] = part.split(equal);
        switch (convertTo) {
          case "int": kv[key] = parseInt(value, 10); break;
          case "float": kv[key] = parseFloat(value); break;
          default: kv[key] = value;
        }

        return;
      });

    return kv;
  }
}
