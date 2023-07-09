import { z } from "zod";
import {
  GamePlatformZod,
  PlatformDropDwonListZod,
  formPlatformFieldsZod,
} from "./addGame";
import { ErrorFormFieldsZod } from "./common";

export type GamePlatform = z.infer<typeof GamePlatformZod>;
export type FormPlatformFields = z.infer<typeof formPlatformFieldsZod>;
export type PlatformDropDwonList = z.infer<typeof PlatformDropDwonListZod>;
export type ErrorFormFields = z.infer<typeof ErrorFormFieldsZod>;

export enum AddGameFormFields {
  platformName = "platformName",
  platformId = "platformId",
  releaseDate = "releaseDate",
  IdNameReleaseDate = "IdNameReleaseDate",
  gameName = "gameName",
  gameDescription = "gameDescription",
  gamePicBlob = "gamePicBlob",
  pictureUrl = "pictureUrl",
}
export enum AddPlatformFormFields {
  name = "name",
}

export enum s3FormFields {
  fileType = "fileType",
}
