import { db } from "./db.server";
import { formatDate } from "./dayjs.date";
import { s3Client } from "./aws.S3Client";
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
import { dbCreateGame } from "./db.crud";
import { getUrlUploadImageToS3 } from "./image.upload";

export {
  db,
  formatDate,
  s3Client,
  getSignedUrl,
  validFileType,
  GamePlatformZod,
  formPlatformFieldsZod,
  PlatformDropDwonListZod,
  AddGameFormFields,
  AddPlatformFormFields,
  s3FormFields,
  ImageUploadApiZod,
  ErrorAddGameFormFieldsZod,
  ErrorAddPlatformFieldsZod,
  dbCreateGame,
  getUrlUploadImageToS3
};
