import { Logger } from "./libs/logger";
const logger: Logger = new Logger();
import * as methodOverride from "method-override";
import * as Sentry from "@sentry/node";
import express from "express";
import { ENV } from "./libs/environment";
import * as bodyParser from "body-parser";
import { RegisterRoutes } from "./routes";
import { NextFunction } from "express-serve-static-core";
import { IHttpException } from "../types/iError";
import { DependencyResolver } from "./dependencyResolver";
const app: express.Express = express();
const env: ENV = new ENV();
Sentry.init({ dsn: env.environments.SENTRY_DSN });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride.default());
app.use((req: Express.Request, res: any, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
  next();
});
app.use((req: Express.Request, res: any, next: NextFunction) => {
  next();
});

RegisterRoutes(app);
//TODO Development mode
app.use((err: IHttpException, req: Express.Request, res: any, next: NextFunction) => {
  if (!err) {
    next();

    return;
  }
  logger.error(err);
  if (err.status === 400 && err.fields) {
    res.status(400).send({ ...{ message: err.message }, ...{ invalidAttributes: err.fields } });
    next();

    return;
  }
  if (err.status === 401) {
    res.status(401).send({ message: err.message });
    next();

    return;
  }
  if (err && err.message && err.message.indexOf("#handled") > -1) {
    //TODO Development mode
    Sentry.captureException(err);
    res.status(400).send({ message: err.message });
    next();

    return;
  }
  next(err);
});

app.use(Sentry.Handlers.errorHandler({
  shouldHandleError: (err: any): boolean => {
    Sentry.captureException(err);
    setTimeout(() => {
      process.exit(1);
    }, 4000);

    return true;
  }
}));
let readiness: boolean = false;
app.get("/readiness", (req: Express.Request, res: Express.Response, next: NextFunction): void => {
  if (readiness) {
    //@ts-ignore
    res.send(200);
  } else {
    //@ts-ignore
    res.send(500);
  }
  next();
});

app.get("/liveness", (req: Express.Request, res: Express.Response, next: NextFunction): void => {
  //@ts-ignore
  res.send(200);
  next();
});

app.listen(env.environments.EXPRESS_PORT, (): void => {
  logger.info(`Listening at http://${env.environments.EXPRESS_HOST}:${env.environments.EXPRESS_PORT}/`);
});

try {
  //@ts-ignore
  const dependencyResolver: DependencyResolver = new DependencyResolver((err: Error, ok: boolean): void => {
    if (!err && ok) {
      readiness = true;
    }
  });

  const sigtermHandler: () => void = (): void => {
    logger.info("SIGTERM RECEIVED");
    readiness = false;
    const timeoutHandler: () => void = (): void => process.exit();
    setTimeout(timeoutHandler, 2000);
  };

  process.on("SIGTERM", sigtermHandler);
} catch (err) {
  Sentry.captureException(err);
  setTimeout((): void => {
    process.exit(1);
  }, 4000);
}
