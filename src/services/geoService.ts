import { Inject, Singleton } from "typescript-ioc";
import { MongoDataSource } from "../libs/database/mongoDataSource";
import { IGeo, ILocation } from "../../types/iGeo";

@Singleton
export class GeoService {
  @Inject
  private readonly dataSource: MongoDataSource;

  public async update(
    userId: string,
    userName: string,
    peerId: string,
    location: ILocation
  ): Promise<{ status: string }> {
    return this.dataSource.updateGeo(userId, userName, peerId, location);
  }

  public async findAround(
    userId: string,
    location: ILocation
  ): Promise<IGeo[]> {
    return this.dataSource.findAround(userId, location);
  }
}
