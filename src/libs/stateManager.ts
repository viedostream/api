import { MongoClient, Collection, InsertOneWriteOpResult } from "mongodb";
import { Singleton, Inject } from "typescript-ioc";
import { IMongoSession, ISession } from "../../types/iSession";
import { ENV } from "./environment";
import { Logger } from "./logger";
import Crypto from "crypto";
import { CustomError, ErrorTypes } from "./customError";
@Singleton
export class StateManager {
  @Inject
  private readonly env: ENV;
  @Inject
  private readonly logger: Logger;
  private sessionCollection: Collection<IMongoSession>;
  public constructor() {
    const mongoClient: MongoClient = new MongoClient(this.env.environments.DATABASE_MONGODB_SESSION_HOST, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoClient.connect((err: Error, client: MongoClient): void => {
      if (err) {
        this.logger.error(err);
        throw err;
      }
      this.logger.info("Session mongo connected!");
      this.sessionCollection = client.db().collection("session");
    });
  }

  public async removeAll(userId: string): Promise<void> {
    await this.sessionCollection.deleteMany({ user_id: userId });
  }

  public async create(userId: string): Promise<string> {
    const token: string = Crypto.randomBytes(32).toString("hex");
    const result: InsertOneWriteOpResult<IMongoSession> = await this.sessionCollection.insertOne(
      {
        _id: token,
        user_id: userId,
        createdAt: new Date(),
        last_modified: new Date()

      });
    if (result.insertedId) {
      return token;
    }

    throw new CustomError(ErrorTypes.UNHANDLED_ERROR);

  }

  public async getSession(token: string): Promise<ISession> {
    const result: IMongoSession = await this.sessionCollection.findOne<IMongoSession>({ _id: token });
    if (!result) {
      throw new CustomError(ErrorTypes.NOT_FOUND);

    }

    return { token: token, userId: result.user_id };

  }

  public async removeSession(token: string): Promise<boolean> {
    await this.sessionCollection.deleteOne({ _id: token });

    return true;

  }
}
