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
import { IGeo, ILocation } from "../../types/iGeo";

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
    @BodyProp("location") location: ILocation,
    @Request() request: RequestData
  ): Promise<{ status: string }> {
    return this.geoService.update(
      request.user.userId,
      request.user.userName,
      peerId,
      location
    );
  }

  @Get("/around")
  @Tags("queryMethod")
  @Security("token")
  public around(
    @Query("lng") lng: number,
    @Query("lat") lat: number,
    @Request() request: RequestData
  ): Promise<IGeo[]> {
    return this.geoService.findAround(request.user.userId, {
      lat, lng
    });
  }
}
