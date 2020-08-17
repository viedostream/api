import { Route, Tags, Controller, Post, BodyProp, Security, Request } from "tsoa";
import { Singleton, Inject } from "typescript-ioc";

import { IUserLoginResponse } from "../../types/responses";
import { UserService } from "../services/userService";
import { RequestData } from "../../types/iSession";

@Route("/user") @Singleton
export class UserController extends Controller {
  @Inject
  private readonly userService: UserService;

  @Post("/create") @Tags("queryMethod")
  public create(@BodyProp("email") email: string, @BodyProp("user") username: string, @BodyProp("password") password: string): Promise<IUserLoginResponse> {
    return this.userService.create(email, username, password);
  }

  @Post("/login") @Tags("queryMethod")
  public login(@BodyProp("emailOrUsername") emailOrUsername: string, @BodyProp("password") password: string): Promise<IUserLoginResponse> {
    return this.userService.login(emailOrUsername, password);
  }

  @Post("/logout") @Tags("queryMethod") @Security("token")
  public logout(@Request() request: RequestData): Promise<boolean> {
    return this.userService.logout(request.user.token);
  }
}
