export interface ISession {
  token?: string;
  userId?: string;
  userName?: string;
  ip?: string;
}

export interface IMongoSession {
  _id: string;
  user_id: string;
  user_name: string;
  last_modified: Date;
  createdAt: Date;
}

export interface RequestData {
  user?: ISession;
}
