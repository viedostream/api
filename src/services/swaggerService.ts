import { Inject } from "typescript-ioc";
import { ENV } from "../libs/environment";
import fs from "fs";
export class SwaggerService {
  @Inject
  private env: ENV;
  public json(): Promise<any> {
    return new Promise((resolve: (result: any) => void, reject: (err: Error) => void): void => {
      if (this.env.environments.NODE_ENV === "development") {
        fs.readFile("./swagger.json", (err: Error, data: Buffer) => {
          if (err) {
            reject(err);

            return;
          }
          resolve(JSON.parse(data.toString("utf8")));
        });
      } else {
        reject(new Error("No access"));
      }
    });
  }
}
