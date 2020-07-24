export interface IEnvironment {
  NODE_ENV: string;
  SENTRY_DSN: string;
  LOG_LEVEL: string;
  EXPRESS_PORT: number;
  EXPRESS_HOST: string;

  DATABASE_MONGODB_SESSION_HOST: string;
  DATABASE_MONGODB_VIEDO_HOST: string;

  ZIXO_WALLET_ADDRESS: string;
  ZIXO_TOKEN: string;

  NETWORK: string;
}
