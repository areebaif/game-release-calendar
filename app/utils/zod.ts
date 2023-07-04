import { EnumLike, EnumValues, ZodEnum, z } from "zod";

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

export const AddGameFormFieldsZod = z.enum(["platformName", ""]);
export const AddNewPlatformFieldsZod = z.enum(["name"]);

export const ErrorFormFieldsZod = z.object({
  isError: z.boolean(),
  message: z.string(),
  field: z.union([AddGameFormFieldsZod, AddNewPlatformFieldsZod]),
});
