export interface IEnvironment {
  NODE_ENV: string;
  SENTRY_DSN: string;
  LOG_LEVEL: string;
  EXPRESS_PORT: number;
  EXPRESS_HOST: string;

  DATABASE_MONGODB_SESSION_HOST: string;
  DATABASE_MONGODB_VIEDO_HOST: string;

  APP_EXPIRRE_GEO_AFTER_SECONDS: number;
  APP_MAX_DISTANCE: number;
}
