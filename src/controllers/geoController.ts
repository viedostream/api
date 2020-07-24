import {
  Route,
  Tags,
  Controller,
  Post,
  BodyProp,
  Security,
  Request,
  Get,
  Query,
} from "tsoa";
import { Singleton, Inject } from "typescript-ioc";

import { GeoService } from "../services/geoService";
import { RequestData } from "../../types/iSession";
import { IGeo } from "../../types/iGeo";

@Route("/geo")
@Singleton
export class GeoController extends Controller {
  @Inject
  private readonly geoService: GeoService;

  @Post("/update")
  @Tags("queryMethod")
  @Security("token")
  public update(
    @BodyProp("peerId") peerId: string,
    @BodyProp("latitude") latitude: number,
    @BodyProp("longitude") longitude: number,
    @Request() request: RequestData
  ): Promise<void> {
    return this.geoService.update(
      request.user.userId,
      peerId,
      latitude,
      longitude
    );
  }

  @Get("/around")
  @Tags("queryMethod")
  @Security("token")
  public around(
    @Query("latitude") latitude: number,
    @Query("longitude") longitude: number,
    @Request() request: RequestData
  ): Promise<IGeo[]> {
    return this.geoService.findAround(request.user.userId, latitude, longitude);
  }
}
