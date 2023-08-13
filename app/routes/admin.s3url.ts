import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { s3Client, validFileType, requireAdminUser } from "~/utils";
import { s3FormFields } from "~/utils/types";

export const action = async ({ request }: ActionArgs) => {
  const user = await requireAdminUser({ request });
  if (!user) return redirect("/");
  const form = await request.formData();
  const fileExt = form.get(s3FormFields.fileType);
  if (typeof fileExt !== "string") {
    throw new Response(null, {
      status: 404,
      statusText: "invalid form fields",
    });
  }

  const validFileExt = validFileType(fileExt);
  if (!validFileExt.isValid) {
    throw new Response(null, {
      status: 404,
      statusText: "provde valid picture format",
    });
  }
  const stringArray = fileExt.split("/");
  const parsedFileExt = stringArray[1];
  const fileName =
    process.env.NODE_ENV === "production"
      ? `game/${uuidv4()}.${parsedFileExt}`
      : `dev/${uuidv4()}.${parsedFileExt}`;

  const s3Params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    ContentType: fileExt,
    // ACL: 'bucket-owner-full-control'
  };
  const command = new PutObjectCommand(s3Params);
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
  return { fileName, signedUrl };
};
