import { Singleton } from "typescript-ioc";

import _ from "lodash";
export enum ErrorTypes { INTERNAL_SERVER_ERROR = 500, FORBIDDEN = 403, UNHANDLED_ERROR = 520, NOT_ENOUGH_SATOSHIS = 412, NOT_FOUND = 404, DUPLICATE = 409, EXPIRED = 410, BAD_REQUEST = 400 }
@Singleton
export class CustomError extends Error {
  public code: number;
  public type?: string;
  public subcode: number;
  public userTitle?: string;
  public userMessage?: string;
  public extraData?: { [name: string]: { message: string } };
  public invalidAttributes?: {
    [name: string]: { message: string };
  };
  private static readonly errors: { [key: string]: CustomError } = {
    500: { name: "INTERNAL_SERVER_ERROR", code: 500, subcode: 500, message: "Internal server error" },
    403: { name: "FORBIDDEN", code: 403, subcode: 403, message: "Access denied." },
    404: { name: "NOT_FOUND", code: 404, subcode: 404, message: "Not found." },
    410: { name: "EXPIRED", code: 410, subcode: 410, message: "Expired." },
    520: { name: "UNHANDLED_ERROR", code: 520, subcode: 520, message: "Unhandled Error." },
    412: { name: "NOT_ENOUGH_SATOSHIS", code: 412, subcode: 4121, message: "Not enough satoshis." },
    409: { name: "DUPLICATE", code: 409, subcode: 409, message: "Duplicate" },
    400: { name: "BAD_REQUEST", code: 400, subcode: 400, message: "Input mismatch." }
  };
  public constructor(type: ErrorTypes, extraData?: { [name: string]: { message: string } }) {
    super(CustomError.errors[type].message);
    const error: CustomError = CustomError.errors[type];
    this.name = error.name;
    this.code = error.code;
    this.subcode = error.subcode;
    Error.captureStackTrace(this, this.constructor);
  }
}
