import { z } from "zod";
import { AddPlatformFormFields, AddGameFormFields } from "./types";

export const ErrorFormFieldsZod = z
  .object({
    isError: z.boolean(),
    message: z.string(),
    field: z.union([
      z.nativeEnum(AddPlatformFormFields),
      z.nativeEnum(AddGameFormFields),
    ]),
  })
  .optional();
