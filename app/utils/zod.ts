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

export const PlatformReleaseListZod = z.object({
  platformId: z.number(),
  platformName: z.string(),
  releaseDate: z.string(),
});
