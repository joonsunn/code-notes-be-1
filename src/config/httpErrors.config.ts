import { HttpError } from "@src/utils/HttpError";

export const ERROR_NOT_FOUND = new HttpError("Not found", 404);
export const ERROR_UNAUTHORIZED = new HttpError("Unauthorized", 401);
export const ERROR_FORBIDDEN = new HttpError("Forbidden", 403);
export const ERROR_INTERNAL_SERVER = new HttpError(
  "Internal server error",
  500
);
export const ERROR_BAD_REQUEST = new HttpError("Bad request", 400);
export const ERROR_CONFLICT = new HttpError("Conflict", 409);
export const ERROR_UNPROCESSABLE_ENTITY = new HttpError(
  "Unprocessable entity",
  422
);
export const ERROR_NOT_IMPLEMENTED = new HttpError("Not implemented", 501);
export const ERROR_GATEWAY_TIMEOUT = new HttpError("Gateway timeout", 504);
export const ERROR_GONE = new HttpError("Gone", 410);
export const ERROR_PRECONDITION_FAILED = new HttpError(
  "Precondition failed",
  412
);
export const ERROR_TOO_MANY_REQUESTS = new HttpError("Too many requests", 429);
