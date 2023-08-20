import { z } from "zod";
import { UserType } from "@prisma/client";
import {
  GamePlatformZod,
  formPlatformFieldsZod,
  ErrorAddGameFormFieldsZod,
  ErrorEditGameFormFieldsZod,
  ErrorDeleteGameFormFieldsZod,
} from "./zod.Game";

import { ImageUploadApiZod } from "./zod.imageUploadApi";
import { ErrorAddPlatformFieldsZod } from "./zod.addPlatform";
import {
  DbAddGameZod,
  DbEditGameZod,
  DbReadGameMetaDataZod,
} from "./zod.db.crud";
import {
  ErrorLoginFormFieldsZod,
  ErrorRegisterUserFormFieldsZod,
  JwtPayloadZod,
  UserPropsForClientZod,
  UserZod,
} from "./zod.userAuth";

export type GamePlatform = z.infer<typeof GamePlatformZod>;
export type FormPlatformFields = z.infer<typeof formPlatformFieldsZod>;
export type ImageUploadApi = z.infer<typeof ImageUploadApiZod>;
export type ErrorAddGameFormFields = z.infer<typeof ErrorAddGameFormFieldsZod>;
export type ErrorAddPlatformFields = z.infer<typeof ErrorAddPlatformFieldsZod>;
export type DbAddGame = z.infer<typeof DbAddGameZod>;
export type DbReadGameMetaData = z.infer<typeof DbReadGameMetaDataZod>;
export type ErrorLoginFormFields = z.infer<typeof ErrorLoginFormFieldsZod>;
export type User = z.infer<typeof UserZod>;
export type UserPropsForClient = z.infer<typeof UserPropsForClientZod>;
export type JwtPayload = z.infer<typeof JwtPayloadZod>;
export type ErrorEditGameFormField = z.infer<typeof ErrorEditGameFormFieldsZod>;
export type ErrorDeleteGameFormField = z.infer<
  typeof ErrorDeleteGameFormFieldsZod
>;
export type DbEditGame = z.infer<typeof DbEditGameZod>;
export type ErrorRegisterUserFormFields = z.infer<
  typeof ErrorRegisterUserFormFieldsZod
>;

export enum AddGameFormFields {
  platformName = "platformName",
  releaseDate = "releaseDate",
  platformId = "platformId",
  platformIdNameReleaseDate = "platformIdNameReleaseDate",
  gameName = "gameName",
  gameDescription = "gameDescription",
  gamePicBlob = "gamePicBlob",
  imageUrl = "imageUrl",
  platformArray = "platformArray",
}

export enum EditGameFormFields {
  platformName = "platformName",
  releaseDate = "releaseDate",
  platformId = "platformId",
  platformIdNameReleaseDate = "platformIdNameReleaseDate",
  gameName = "gameName",
  gameDescription = "gameDescription",
  gameId = "gameId",
}

export enum DeleteGameFormFields {
  GameId = "GameId",
}

export enum AddPlatformFormFields {
  name = "name",
}

export enum s3FormFields {
  fileType = "fileType",
}

export enum LoginFormFields {
  emailUserName = "emailUserName",
  password = "password",
  userType = "userType",
}

export enum RegisterUserFormFields {
  email = "email",
  password = "password",
  userType = "userType",
  userName = "userName",
}

export enum UserTypeForm {
  ADMIN = "ADMIN",
  STANDARD = "STANDARD",
}
