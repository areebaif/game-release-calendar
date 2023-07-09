import { validFileType } from "./fileType";
import { s3FormFields } from "./zod";
export const uploadPicture = async (fileType: string) => {
  // TODO: send type as params
  // revalidate again at backend

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
  const res: { fileName: string; signedUrl: string } = await response.json();
  return res;
};
