import { validFileType, ImageUploadApiZod } from ".";
import { ImageUploadApi, s3FormFields } from "./types";

export const getSignedUrl = async (fileType: string) => {
  const testFileType = validFileType(fileType);
  if (!testFileType.isValid) {
    throw new Response(null, {
      status: 400,
      statusText: "invalid file type provided",
    });
  }
  const s3FormData = new FormData();
  s3FormData.append(s3FormFields.fileType, fileType);
  const response = await fetch(`/admin/s3url`, {
    method: "POST",
    body: s3FormData,
  });

  if (!response.ok) {
    throw new Response(null, {
      status: 500,
      statusText: "internal server error, failed to upload image",
    });
  }
  const res: ImageUploadApi = await response.json();
  const parseResponse = ImageUploadApiZod.safeParse(res);
  if (!parseResponse.success) {
    console.log(parseResponse.error);
    throw new Response(null, {
      status: 500,
      statusText: "internal server error, type incompatibility",
    });
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

  if (!response.ok)
    throw new Response(null, {
      status: 500,
      statusText: " internal server error, failed to upload image",
    });
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
