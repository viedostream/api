export interface IMongoUser {
  _id: string;
  username: string;
  password: string;
  email: string;
  created_at: Date;
}
export interface IUser {
  userId: string;
  email?: string;
}
