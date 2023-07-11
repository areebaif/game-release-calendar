import { z } from "zod";
import { AddGameFormFields } from "./types";

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

export const ErrorAddGameFormFieldsZod = z
  .object({
    [AddGameFormFields.platformName]: z.string().optional(),
    [AddGameFormFields.releaseDate]: z.string().optional(),
    [AddGameFormFields.platformId]: z.string().optional(),
    [AddGameFormFields.gameName]: z.string().optional(),
    [AddGameFormFields.gameDescription]: z.string().optional(),
    [AddGameFormFields.imageUrl]: z.string().optional(),
    [AddGameFormFields.gamePicBlob]: z.string().optional(),
    [AddGameFormFields.platformIdNameReleaseDate]: z.string().optional(),
  })
  .optional();
