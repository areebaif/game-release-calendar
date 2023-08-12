import { db } from "./db.server";
import { formatDate } from "./dayjs.date";
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
  UserZod,
} from "./zod.userAuth";
import { DbReadGameMetaDataZod } from "./zod.db.crud";
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
} from "./db.server.crud";
import {
  loginUser,
  logoutUser,
  createUserSession,
  verifyJwtToken,
  requireAdminUser,
  authenticatedUser,
} from "./session.server";

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
};
