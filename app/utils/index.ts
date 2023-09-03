import { db } from "./db.server";
import {
  formatDate,
  getNewDateAddMonth,
  getEndOfCurrentMonth,
  getStartOfCurrentMonth,
  getEndOfYear,
  getStartOfYear,
  getMonthNumber,
} from "./dayjs.date";
import { s3Client } from "./awsS3Client.server";

import {
  GamePlatformZod,
  formPlatformFieldsZod,
  ErrorAddGameFormFieldsZod,
  validImageSizeZod,
  validImageTypeZod,
} from "./zod.Game";

import { ErrorAddPlatformFieldsZod } from "./zod.addPlatform";
import { ErrorAddGameGenreFormFieldsZod } from "./zod.addGameGenre";

import {
  UserPropsForClientZod,
  ErrorLoginFormFieldsZod,
  ErrorRegisterUserFormFieldsZod,
  UserZod,
  CredentialEmailZod,
} from "./zod.userAuth";
import { DbReadGameMetaDataZod, DbReadGameByYearZod } from "./zod.db.crud";
import { uploadImagesToS3, deleteImagesFromS3, parseImageUrl } from "./image";
import {
  dbGetAllGamesData,
  dbCreateUser,
  dbGetUserByEmail,
  dbGetUserByUserName,
  dbGetUserById,
  dbCreateGame,
  dbGetGameDataById,
  dbDeleteGameById,
  dbGetCurrentMonthGames,
  dbCreateMultipleGames,
  dbGetGameByYear,
  resetUserPassword,
} from "./db.server.crud";
import {
  loginUser,
  logoutUser,
  createUserSession,
  verifyJwtToken,
  requireAdminUser,
  authenticatedUser,
} from "./session.server";
import { sendCredentialsEmail } from "./sendgrid.server";

export {
  db,
  formatDate,
  s3Client,
  GamePlatformZod,
  formPlatformFieldsZod,
  UserPropsForClientZod,
  ErrorAddGameFormFieldsZod,
  ErrorAddPlatformFieldsZod,
  dbCreateGame,
  dbGetAllGamesData,
  DbReadGameMetaDataZod,
  dbCreateUser,
  dbGetUserByEmail,
  dbGetUserByUserName,
  loginUser,
  createUserSession,
  verifyJwtToken,
  requireAdminUser,
  dbGetUserById,
  authenticatedUser,
  logoutUser,
  dbGetGameDataById,
  dbDeleteGameById,
  ErrorLoginFormFieldsZod,
  UserZod,
  sendCredentialsEmail,
  ErrorRegisterUserFormFieldsZod,
  CredentialEmailZod,
  uploadImagesToS3,
  deleteImagesFromS3,
  validImageSizeZod,
  validImageTypeZod,
  dbCreateMultipleGames,
  dbGetCurrentMonthGames,
  getNewDateAddMonth,
  getEndOfCurrentMonth,
  getStartOfCurrentMonth,
  getEndOfYear,
  getStartOfYear,
  getMonthNumber,
  DbReadGameByYearZod,
  dbGetGameByYear,
  ErrorAddGameGenreFormFieldsZod,
  resetUserPassword,
  parseImageUrl,
};
