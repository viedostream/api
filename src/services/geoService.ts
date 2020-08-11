import { Inject, Singleton } from "typescript-ioc";
import { MongoDataSource } from "../libs/database/mongoDataSource";
import { IGeo } from "../../types/iGeo";

@Singleton
export class GeoService {
  @Inject
  private readonly dataSource: MongoDataSource;

  public async update(
    userId: string,
    peerId: string,
    latitude: number,
    longitude: number
  ): Promise<{ status: string }> {
    return this.dataSource.updateGeo(userId, peerId, latitude, longitude);
  }

  public async findAround(
    userId: string,
    latitude: number,
    longitude: number
  ): Promise<IGeo[]> {
    return this.dataSource.findAround(userId, latitude, longitude);
  }
}
