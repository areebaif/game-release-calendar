import { z } from "zod";
import {
  GamePlatformZod,
  PlatformDropDwonListZod,
  formPlatformFieldsZod,
  ErrorAddGameFormFieldsZod,
} from "./zod.addGame";

import { ImageUploadApiZod } from "./zod.imageUploadApi";
import { ErrorAddPlatformFieldsZod } from "./zod.addPlatform";

export type GamePlatform = z.infer<typeof GamePlatformZod>;
export type FormPlatformFields = z.infer<typeof formPlatformFieldsZod>;
export type PlatformDropDwonList = z.infer<typeof PlatformDropDwonListZod>;
export type ImageUploadApi = z.infer<typeof ImageUploadApiZod>;
export type ErrorAddGameFormFields = z.infer<typeof ErrorAddGameFormFieldsZod>;
export type ErrorAddPlatformFields = z.infer<typeof ErrorAddPlatformFieldsZod>;

export enum AddGameFormFields {
  platformName = "platformName",
  releaseDate = "releaseDate",
  platformId = "platformId",
  platformIdNameReleaseDate = "platformIdNameReleaseDate",
  gameName = "gameName",
  gameDescription = "gameDescription",
  gamePicBlob = "gamePicBlob",
  imageUrl = "imageUrl",
}

export enum AddPlatformFormFields {
  name = "name",
}

export enum s3FormFields {
  fileType = "fileType",
}

export type AddGameDbFormFIeld = {
  platform: {
    platformId: number;
    platformName: string;
    releaseDate: string;
  }[];
  GameName: string;
  description: string;
  imageUrl: string;
};
