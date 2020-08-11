import { Inject, Singleton } from "typescript-ioc";
import { MongoDataSource } from "../libs/database/mongoDataSource";
import { IUserLoginResponse } from "../../types/responses";
import { StateManager } from "../libs/stateManager";

@Singleton
export class UserService {
  @Inject
  private readonly dataSource: MongoDataSource;

  @Inject
  private readonly stateManager: StateManager;

  public async create(email: string, username: string, password: string): Promise<IUserLoginResponse> {
    const userId: string = await this.dataSource.createUser(email, username, password);
    const token: string = await this.stateManager.create(userId);

    return { token };
  }

  public async login(emailOrUsername: string, password: string): Promise<IUserLoginResponse> {
    const userId: string = await this.dataSource.getUserLogin(emailOrUsername, password);
    await this.stateManager.removeAll(userId);
    const token: string = await this.stateManager.create(userId);

    return { token };
  }

  public async logout(token: string): Promise<boolean> {
    return this.stateManager.removeSession(token);
  }
}
