import { z } from "zod";

import {
  GamePlatformZod,
  formPlatformFieldsZod,
  ErrorAddGameFormFieldsZod,
  ErrorEditGameFormFieldsZod,
  ErrorDeleteGameFormFieldsZod,
  GameGenreZod,
} from "./zod.Game";

import { ErrorAddPlatformFieldsZod } from "./zod.addPlatform";
import {
  DbAddGameZod,
  DbEditGameZod,
  DbReadGameMetaDataZod,
  DbReadGameByYearZod,
} from "./zod.db.crud";
import {
  ErrorLoginFormFieldsZod,
  ErrorRegisterUserFormFieldsZod,
  JwtPayloadZod,
  UserPropsForClientZod,
  UserZod,
} from "./zod.userAuth";
import { ErrorAddGameGenreFormFieldsZod } from "./zod.addGameGenre";

export type GamePlatform = z.infer<typeof GamePlatformZod>;
export type FormPlatformFields = z.infer<typeof formPlatformFieldsZod>;
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
export type DbReadGameByYear = z.infer<typeof DbReadGameByYearZod>;
export type ErrorAddGameGenreFormFields = z.infer<
  typeof ErrorAddGameGenreFormFieldsZod
>;
export type GameGenre = z.infer<typeof GameGenreZod>;
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
  gameGenre = "gameGenre",
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

export enum AddGameGenreFormFields {
  name = "name",
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

export enum MonthNames {
  January = "January",
  February = "February",
  March = "March",
  April = "April",
  May = "May",
  June = "June",
  July = "July",
  August = "August",
  September = "September",
  October = "October",
  November = "November",
  December = "December",
}
