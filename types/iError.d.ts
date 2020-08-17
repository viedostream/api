export interface IError {
  message?: string;
  type?: string;
  subcode: number;
  code: number;
  userTitle?: string;
  userMessage?: string;
  extraData?: { [name: string]: { message: string } };
  invalidAttributes?: {
    [name: string]: { message: string };
  };
}

export interface IHttpException extends Error {
  status: number;
  message: string;
  fields: { [name: string]: { message: string } };
}
