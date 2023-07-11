import z from "zod";
import { AddPlatformFormFields } from "./types";

export const ErrorAddPlatformFieldsZod = z.object({
  [AddPlatformFormFields.name]: z.string().optional(),
});
