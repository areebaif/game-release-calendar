import { z } from "zod";
import { LoginFormFields } from "./types";

export const ErrorLoginFormFieldsZod = z
  .object({
    [LoginFormFields.email]: z.string().optional(),
    [LoginFormFields.password]: z.string().optional(),
    [LoginFormFields.loginType]: z.string().optional(),
  })
  .optional();
