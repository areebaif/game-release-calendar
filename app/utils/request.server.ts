import { BadRequest } from "./types";

export const badRequest = (data: BadRequest) => {
  return { ...data };
};
