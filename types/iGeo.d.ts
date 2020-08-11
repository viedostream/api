import { ObjectID } from "mongodb";

export interface IMongoGeo {
  _id: ObjectID;
  user_id: string;
  peer_id: string;
  location: number[];
  created_at: Date;
}

export interface IGeo {
  id: string;
  peerId: string;
  location: number[];
}
