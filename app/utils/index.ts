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
import { getSignedUrl } from "./image.upload";
import { validFileType } from "./image.validFileType";
import {
  GamePlatformZod,
  formPlatformFieldsZod,
  PlatformDropDwonListZod,
  ErrorAddGameFormFieldsZod,
} from "./zod.Game";

import { ErrorAddPlatformFieldsZod } from "./zod.addPlatform";
import { ImageUploadApiZod } from "./zod.imageUploadApi";
import {
  UserPropsForClientZod,
  ErrorLoginFormFieldsZod,
  ErrorRegisterUserFormFieldsZod,
  UserZod,
} from "./zod.userAuth";
import { DbReadGameMetaDataZod, DbReadGameByYearZod } from "./zod.db.crud";
import { getUrlUploadImageToS3 } from "./image.upload";
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
  dbGetGameByYear,
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
  getSignedUrl,
  validFileType,
  GamePlatformZod,
  formPlatformFieldsZod,
  PlatformDropDwonListZod,
  UserPropsForClientZod,
  ImageUploadApiZod,
  ErrorAddGameFormFieldsZod,
  ErrorAddPlatformFieldsZod,
  dbCreateGame,
  getUrlUploadImageToS3,
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
  dbGetCurrentMonthGames,
  getNewDateAddMonth,
  getEndOfCurrentMonth,
  getStartOfCurrentMonth,
  getEndOfYear,
  getStartOfYear,
  dbGetGameByYear,
  DbReadGameByYearZod,
  getMonthNumber,
};
