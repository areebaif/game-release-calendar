import { z } from "zod";
import { AddGameFormFields, EditGameFormFields } from "./types";

export const GamePlatformZod = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const formPlatformFieldsZod = z.object({
  platformId: z.string().uuid(),
  platformName: z.string(),
  releaseDate: z.string(),
});

export const PlatformDropDwonListZod = z.object({
  value: z.string(),
  label: z.string(),
  id: z.string().uuid(),
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

export const ErrorEditGameFormFieldsZod = z
  .object({
    [EditGameFormFields.platformName]: z.string().optional(),
    [EditGameFormFields.releaseDate]: z.string().optional(),
    [EditGameFormFields.platformId]: z.string().optional(),
    [EditGameFormFields.gameName]: z.string().optional(),
    [EditGameFormFields.gameDescription]: z.string().optional(),
    [EditGameFormFields.gameId]: z.string().optional(),
    [EditGameFormFields.platformIdNameReleaseDate]: z.string().optional(),
  })
  .optional();

export const ErrorDeleteGameFormFieldsZod = z
  .object({
    [EditGameFormFields.gameId]: z.string().optional(),
  })
  .optional();

