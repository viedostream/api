import { Inject } from "typescript-ioc";
import { StateManager } from "./libs/stateManager";
import { MongoDataSource } from "./libs/database/mongoDataSource";

export class DependencyResolver {
  @Inject
  private readonly stateManager: StateManager;
  @Inject
  private readonly dataSource: MongoDataSource;

  public constructor(callback: (err: Error, ok: boolean) => void) {
    this.stateManager.getSession("").catch((): void => undefined);
    this.dataSource.getUserLogin("", "").catch((): void => undefined);
  }
}
