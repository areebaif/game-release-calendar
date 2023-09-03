import { DbAddGame } from "./types";
import { s3Client } from ".";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export const uploadImagesToS3 = (games: { [key: string]: DbAddGame }) => {
  const imagePromises = [];
  for (const property in games) {
    const image = games[property].imageBlob;
    const stringArray = games[property].imageType.split("/");
    const parsedFileExt = stringArray[1];
    const imageKey =
      process.env.NODE_ENV === "production"
        ? `game/${uuidv4()}.${parsedFileExt}`
        : `dev/${uuidv4()}.${parsedFileExt}`;

    // store the uuid in the imageUrl property so that the database can save the image url
    games[property].imageUrl = imageKey;
    // send the uuid as file/ imageName to s3 to S3
    imagePromises.push(uploadToS3(image, imageKey, games[property].imageType));
  }
  return imagePromises;
};

const uploadToS3 = (image: Buffer, imageKey: string, imageType: string) => {
  const s3Params = {
    Bucket: process.env.BUCKET_NAME,
    Body: image,
    Key: imageKey,
    ContentType: imageType,
  };

  const command = new PutObjectCommand(s3Params);
  return s3Client.send(command);
};

export const deleteImagesFromS3 = (games: { [key: string]: DbAddGame }) => {
  const deleteFromS3 = [];
  for (const property in games) {
    const s3Params = {
      Bucket: process.env.BUCKET_NAME,
      Key: games[property].imageUrl,
    };
    const command = new DeleteObjectCommand(s3Params);
    deleteFromS3.push(s3Client.send(command));
  }
  return deleteFromS3;
};

export const parseImageUrl = (imageUrl: string) => {
  return process.env.NODE_ENV === "development"
    ? `${process.env.IMAGE_BASE_URL_DEVELOPMENT}/${imageUrl}`
    : `${process.env.IMAGE_BASE_URL_PRODUCTION}/${imageUrl}`;
};
