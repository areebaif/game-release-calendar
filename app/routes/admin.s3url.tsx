import type { ActionArgs, TypedResponse, LoaderArgs } from "@remix-run/node";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { s3Client, validFileType } from "~/utils";
import { s3FormFields } from "~/utils/zod";

// export async function loader({ params }: LoaderArgs) {
//   // console.log(key, "holla");
//   const fileType = params.fileType;
//   // this will be only png
//   console.log(
//     fileType,
//     "@@@@@@@@@@@@@@@@@@@@@@@@@@!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!dhdhjdjhdjh"
//   );
//   const file = validFileType(fileType);
//   if (!file.isValid!) throw new Error("bad request: file type not valid");
//   const fileName = `game/${uuidv4()}.${fileType}`;
//   const s3Params = {
//     Bucket: process.env.BUCKET_NAME,
//     Key: fileName,
//     ContentType: file.fileExtension!,
//     // ACL: 'bucket-owner-full-control'
//   };
//   const command = new PutObjectCommand(s3Params);
//   const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
//   console.log(signedUrl, fileName);
//   return { fileName, signedUrl };
// }

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const fileExt = form.get(s3FormFields.fileType);
  if (typeof fileExt !== "string") {
    throw new Error("invalid form fields");
  }
  const validFileExt = validFileType(fileExt);
  if (!validFileExt.isValid) {
    throw new Error(
      "bad request: invalid picture format. Supply image of type png, or jpeg"
    );
  }

  const fileName = `game/${uuidv4()}.${validFileExt.fileExtension}`;
  const s3Params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    ContentType: validFileExt.fileExtension!,
    // ACL: 'bucket-owner-full-control'
  };
  const command = new PutObjectCommand(s3Params);
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
  console.log(signedUrl, fileName);
  return { fileName, signedUrl };
};
