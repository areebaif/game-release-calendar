import { PutObjectCommand } from "@aws-sdk/client-s3";
import type { PutObjectCommandInput } from "@aws-sdk/client-s3";
import { validFileType } from "./fileType";
import { s3FormFields, ImageUploadApiZod } from "./zod";
import { ImageUploadApi } from "./zod/types";
import { s3Client } from "./awsS3";

export const uploadPicture = async (fileType: string) => {
  const testFileType = validFileType(fileType);
  if (!testFileType.isValid) {
    throw new Error("bad request: file type not valid");
  }
  const s3FormData = new FormData();
  s3FormData.append(s3FormFields.fileType, fileType);
  const response = await fetch(`/admin/s3url/`, {
    method: "POST",
    body: s3FormData,
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res: ImageUploadApi = await response.json();
  const parseResponse = ImageUploadApiZod.safeParse(res);
  if (!parseResponse.success) {
    console.log(parseResponse.error);
    throw new Error("internal server error: type incompatibility");
  }
  return res;
};

export const uploadToS3 = async (
  pictureBlob: File,
  contentType: string,
  preSignedURL: string
) => {
  console.log(
    pictureBlob,
    contentType,
    preSignedURL,
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  );
  const response = await fetch(preSignedURL, {
    method: "PUT",
    headers: { contentType: contentType },
    body: pictureBlob,
  });
  const res = response.json();
  return res;
};
