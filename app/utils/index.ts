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
} from "./zod.addGame";
import {
  AddGameFormFields,
  AddPlatformFormFields,
  s3FormFields,
} from "./types";
import { ErrorAddPlatformFieldsZod } from "./zod.addPlatform";
import { ImageUploadApiZod } from "./zod.imageUploadApi";
import { UserPropsForClientZod } from "./zod.userAuth";
import { dbCreateGame } from "./db.server.crud";
import { DbReadGameMetaDataZod } from "./zod.db.crud";
import { getUrlUploadImageToS3 } from "./image.upload";
import {
  dbGetAllGamesData,
  dbCreateUser,
  dbGetUserByEmail,
  dbGetUserByUserName,
  dbGetUserById,
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
  AddGameFormFields,
  AddPlatformFormFields,
  s3FormFields,
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
};
