import { validFileType, s3FormFields, ImageUploadApiZod } from ".";
import { ImageUploadApi } from "./types";

export const getSignedUrl = async (fileType: string) => {
  const testFileType = validFileType(fileType);
  if (!testFileType.isValid) {
    throw new Error("bad request: file type not valid");
  }
  const s3FormData = new FormData();
  s3FormData.append(s3FormFields.fileType, fileType);
  const response = await fetch(`/admin/s3url`, {
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
  fileType: string,
  preSignedURL: string
) => {
  const response = await fetch(preSignedURL, {
    method: "PUT",
    headers: { contentType: fileType },
    body: pictureBlob,
  });

  if (!response.ok) throw new Error(" failed to upload image to se");
  return response.ok;
};

type getUrlUploadImage = {
  fileType: string;
  image: File;
};

export const getUrlUploadImageToS3 = async (data: getUrlUploadImage) => {
  const { fileType, image } = data;
  const signedUrl = await getSignedUrl(fileType);

  const uploadS3 = await uploadToS3(image, fileType, signedUrl.signedUrl);
  return { fileName: signedUrl.fileName };
};
