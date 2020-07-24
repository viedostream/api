import { Request } from "express";
import { ISession } from "./iSession";
export interface ISessionRequest extends Request {
  session: ISession;
}
