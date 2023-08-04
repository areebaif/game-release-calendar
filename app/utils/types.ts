import { z } from "zod";
import {
  GamePlatformZod,
  PlatformDropDwonListZod,
  formPlatformFieldsZod,
  ErrorAddGameFormFieldsZod,
} from "./zod.addGame";

import { ImageUploadApiZod } from "./zod.imageUploadApi";
import { ErrorAddPlatformFieldsZod } from "./zod.addPlatform";
import { DbAddGameZod, DbReadGameMetaDataZod } from "./zod.db.crud";
import { ErrorLoginFormFieldsZod, UserZod } from "./zod.userAuth";

export type GamePlatform = z.infer<typeof GamePlatformZod>;
export type FormPlatformFields = z.infer<typeof formPlatformFieldsZod>;
export type PlatformDropDwonList = z.infer<typeof PlatformDropDwonListZod>;
export type ImageUploadApi = z.infer<typeof ImageUploadApiZod>;
export type ErrorAddGameFormFields = z.infer<typeof ErrorAddGameFormFieldsZod>;
export type ErrorAddPlatformFields = z.infer<typeof ErrorAddPlatformFieldsZod>;
export type DbAddGame = z.infer<typeof DbAddGameZod>;
export type DbReadGameMetaData = z.infer<typeof DbReadGameMetaDataZod>;
export type ErrorLoginFormFields = z.infer<typeof ErrorLoginFormFieldsZod>;
export type User = z.infer<typeof UserZod>;

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

export enum LoginFormFields {
  email = "email",
  password = "password",
  loginType = "loginType",
}
