import { z } from "zod";

export const BadRequestZod = z.object({
  fieldErrors: z.string().nullable(),
  fields: z.string().nullable(),
  formErrors: z.string().nullable(),
});
