import { Route, Controller, Get } from "tsoa";
import { Singleton, Inject } from "typescript-ioc";
import { SwaggerService } from "../services/swaggerService";

@Route("/") @Singleton
export class SwaggerController extends Controller {
  @Inject
  private swaggerService: SwaggerService;
  @Get("/swagger.json")
  public json(): Promise<any> {
    return this.swaggerService.json();
  }
}
