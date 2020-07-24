import * as express from "express";
import { StateManager } from "./stateManager";
import { Logger } from "./logger";
import { ISession } from "../../types/iSession";
import { IError } from "../../types/iError";
import { CustomError, ErrorTypes } from "./customError";
const stateManager: StateManager = new StateManager();
const logger: Logger = new Logger();
export function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<ISession> {
  return new Promise((resolve: (result: ISession) => void, reject: (err: IError) => void): void => {
    if (securityName === "token") {
      const token: string = (request.body && request.body.token) || (request.query && request.query.token) || request.headers.token;
      stateManager.getSession(token)
        .then((session: ISession) => {
          if (!session) {
            reject(new CustomError(ErrorTypes.NOT_FOUND));

            return undefined;
          }
          resolve({ userId: session.userId, ip: request.ip });
        })
        .catch((err: Error) => {
          logger.error(err);
          reject(new CustomError(ErrorTypes.UNHANDLED_ERROR));
        });
    } else if (securityName === "optional") {
      const token: string = (request.body && request.body.token) || (request.query && request.query.token) || request.headers.token;
      if (!token) {
        resolve({});

        return;
      }
      stateManager.getSession(token)
        .then((session: ISession) => {
          if (!session) {
            logger.error(`Wrong token ${token}`);
            reject(new CustomError(ErrorTypes.NOT_FOUND));

            return undefined;
          }
          resolve({ userId: session.userId, ip: request.ip });
        })
        .catch((err: Error) => {
          logger.error(err);
          reject(new CustomError(ErrorTypes.UNHANDLED_ERROR));
        });
    } else {
      logger.error("Unknown optional token");
      reject(new CustomError(ErrorTypes.UNHANDLED_ERROR));
    }
  });
}
