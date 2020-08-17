import { Inject, Singleton } from "typescript-ioc";
import { MongoDataSource } from "../libs/database/mongoDataSource";
import { IUserLoginResponse } from "../../types/responses";
import { StateManager } from "../libs/stateManager";
import { IUser } from "../../types/iUser";

@Singleton
export class UserService {
  @Inject
  private readonly dataSource: MongoDataSource;

  @Inject
  private readonly stateManager: StateManager;

  public async create(email: string, username: string, password: string): Promise<IUserLoginResponse> {
    username = username.toLowerCase();
    email = email.toLowerCase();
    const userId: string = await this.dataSource.createUser(email, username, password);
    const token: string = await this.stateManager.create(userId, username);

    return { token };
  }

  public async login(emailOrUsername: string, password: string): Promise<IUserLoginResponse> {
    emailOrUsername = emailOrUsername.toLowerCase();
    const user: IUser = await this.dataSource.getUserLogin(emailOrUsername, password);
    await this.stateManager.removeAll(user.userId);
    const token: string = await this.stateManager.create(user.userId, user.userName);

    return { token };
  }

  public async logout(token: string): Promise<boolean> {
    return this.stateManager.removeSession(token);
  }
}
