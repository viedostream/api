import { MongoClient, Collection, InsertOneWriteOpResult } from "mongodb";
import _ from "lodash";
import { Inject, Singleton } from "typescript-ioc";
import { ENV } from "../environment";
import { CustomError, ErrorTypes } from "../customError";
import crypto from "crypto";
import { IMongoUser, IUser } from "../../../types/iUser";
import { IMongoGeo, IGeo, ILocation } from "../../../types/iGeo";
import { Logger } from "../logger";
import { series } from "async";

@Singleton
export class MongoDataSource {
  @Inject
  private readonly env: ENV;
  @Inject
  private readonly logger: Logger;
  private userCollection: Collection<IMongoUser>;
  private geoCollection: Collection<IMongoGeo>;

  public constructor() {
    const mongoClient: MongoClient = new MongoClient(
      this.env.environments.DATABASE_MONGODB_VIEDO_HOST,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    mongoClient.connect((err: Error, client: MongoClient): void => {
      if (err) {
        throw err;
      }
      this.logger.info("Data source mongo connected!");
      this.userCollection = client.db().collection("user");
      this.geoCollection = client.db().collection("geo");
      client
        .db()
        .listCollections()
        .toArray()
        .then((collections: any[]): void => {
          if (collections.length === 0) {
            series([
              (cb: () => void): void => {
                this.userCollection
                  .createIndex({ username: 1 }, { unique: true })
                  .then((): void => {
                    cb();
                  });
              },
              (cb: () => void): void => {
                this.userCollection
                  .createIndex({ password: 1 })
                  .then((): void => {
                    cb();
                  });
              },
              (cb: () => void): void => {
                this.userCollection
                  .createIndex({ email: 1 }, { unique: true })
                  .then((): void => {
                    cb();
                  });
              },
              (cb: () => void): void => {
                this.userCollection
                  .createIndex({ password: 1 })
                  .then((): void => {
                    cb();
                  });
              },
              (cb: () => void): void => {
                this.geoCollection
                  .createIndex({ user_id: 1 }, { unique: true })
                  .then((): void => {
                    cb();
                  });
              },
              (cb: () => void): void => {
                this.geoCollection
                  .createIndex({ location: "2dsphere" })
                  .then((): void => {
                    cb();
                  });
              },
            ]);
          }
        });
    });
  }

  public async createUser(
    email: string,
    username: string,
    password: string
  ): Promise<string> {
    const userId: string = crypto.randomBytes(32).toString("hex");
    try {
      const insertedRecord: InsertOneWriteOpResult<{ _id: string }> = await this.userCollection.insertOne({
        _id: userId,
        email: email,
        username: username,
        password: password,
        created_at: new Date(),
      });
      if (insertedRecord.insertedId) {
        return userId;
      }
      throw new CustomError(ErrorTypes.UNHANDLED_ERROR);
    } catch (err) {
      this.logger.error(err);
      throw new CustomError(ErrorTypes.UNHANDLED_ERROR);
    }
  }

  public async getUserLogin(
    emailOrUsername: string,
    password: string
  ): Promise<IUser> {
    const findUser: IMongoUser = await this.userCollection.findOne({
      $and: [
        { $or: [{ username: emailOrUsername }, { email: emailOrUsername }] },
        { password: password },
      ],
    });
    if (findUser) {
      return { userId: findUser._id, userName: findUser.username };
    }

    throw new CustomError(ErrorTypes.UNHANDLED_ERROR);
  }

  public async updateGeo(
    userId: string,
    userName: string,
    peerId: string,
    location: ILocation
  ): Promise<{ status: string }> {
    this.geoCollection.updateOne(
      { user_id: userId },
      {
        $set: {
          peer_id: peerId,
          user_name: userName,
          location: [location.lng, location.lat],
          created_at: new Date(),
        },
      },
      { upsert: true }
    );

    return { status: "ok" };
  }

  public async findAround(
    userId: string,
    location: ILocation
  ): Promise<IGeo[]> {
    const points: IMongoGeo[] = await this.geoCollection
      .find({
        $and: [
          {
            created_at: {
              $gte: new Date(new Date().getTime() - this.env.environments.APP_EXPIRRE_GEO_AFTER_SECONDS * 1000)
            }
          }
          , {
            location: {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: [location.lng, location.lat],
                },
                $maxDistance: this.env.environments.APP_MAX_DISTANCE,
                $minDistance: 0,
              },
            },
          }]
      })
      .toArray();

    return points.map(
      (p: IMongoGeo): IGeo => ({
        id: p._id.toHexString(),
        userName: p.user_name,
        peerId: p.peer_id,
        location: {
          lat: p.location[1],
          lng: p.location[0]
        },
      })
    );
  }
}
