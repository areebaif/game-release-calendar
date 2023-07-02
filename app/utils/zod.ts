import { z } from "zod";

export const BadRequestZod = z.optional(
  z.object({
    fieldErrors: z.string().nullable(),
    fields: z.string().nullable(),
    formErrors: z.string().nullable(),
  })
);

export const GamePlatformZod = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const formPlatformFieldsZod = z.object({
  platformId: z.number(),
  platformName: z.string(),
  releaseDate: z.string(),
});

export const PlatformDropDwonListZod = z.object({
  value: z.string(),
  label: z.string(),
  id: z.number(),
  name: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
