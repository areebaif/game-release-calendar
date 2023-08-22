import z from "zod";
import { AddGameGenreFormFields } from "./types";

export const ErrorAddGameGenreFormFieldsZod = z
  .object({
    [AddGameGenreFormFields.name]: z.string().optional(),
  })
  .optional();
