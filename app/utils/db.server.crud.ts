import bcrypt from "bcryptjs";
import { UserType } from "@prisma/client";
import { db } from "./db.server";
import { DbAddGame, DbReadGameMetaData, DbEditGame } from "./types";
import { saltRounds } from "./session.server";
import { s3Client } from "~/utils";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const dbCreateGame = async (data: DbAddGame) => {
  const { title, description, platform, imageUrl } = data;
  const parsedPlatforms = platform.map((platform) => {
    return {
      gamePlatformId: platform.platformId,
      releaseDate: platform.releaseDate,
    };
  });

  const game = await db.game.create({
    data: {
      title: title,
      description: description,
      imageUrl: imageUrl,
      gameMetaData: {
        createMany: {
          data: parsedPlatforms,
        },
      },
    },
  });
};

export const dbEditGame = async (data: DbEditGame) => {
  const { title, description, platform, gameId } = data;
  const parsedPlatforms = platform.map((platform) => {
    return {
      gamePlatformId: platform.platformId,
      releaseDate: platform.releaseDate,
    };
  });
  // delete old values
  const deleteMetaData = db.gameMetaData.deleteMany({
    where: {
      gameId: gameId,
    },
  });
  const game = db.game.update({
    where: {
      id: gameId,
    },
    data: {
      title: title,
      description: description,
      gameMetaData: {
        createMany: {
          data: parsedPlatforms,
        },
      },
    },
  });
  await db.$transaction([deleteMetaData, game]);
};

export const dbGetAllGamesData = async () => {
  const gameMetaData = await db.gameMetaData.findMany({
    orderBy: {
      gameId: "asc",
    },
    include: {
      game: {
        select: {
          title: true,
          imageUrl: true,
          description: true,
        },
      },
      GamePlatform: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  const result: DbReadGameMetaData[] = [];
  gameMetaData.forEach((gameItem, index) => {
    const game: DbReadGameMetaData["game"] = {
      ...gameItem.game,
      gameId: gameItem.gameId,
    };
    const platform: DbReadGameMetaData["platform"][0] = {
      platformId: gameItem.GamePlatform.id,
      platformName: gameItem.GamePlatform.name,
      releaseDate: new Date(`${gameItem.releaseDate}`).toISOString(),
    };
    if (index !== 0 && gameItem.gameId === gameMetaData[index - 1].gameId) {
      result[result.length - 1].platform.push(platform);
      return;
    }
    return result.push({ game, platform: [platform] });
  });
  return result;
};

export const dbGetGameDataById = async (gameId: string) => {
  const gameMetaData = await db.gameMetaData.findMany({
    where: {
      gameId: gameId,
    },
    orderBy: {
      gameId: "asc",
    },
    include: {
      game: {
        select: {
          title: true,
          imageUrl: true,
          description: true,
        },
      },
      GamePlatform: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
  const result: DbReadGameMetaData[] = [];
  gameMetaData.forEach((gameItem, index) => {
    const game: DbReadGameMetaData["game"] = {
      ...gameItem.game,
      gameId: gameItem.gameId,
    };
    const platform: DbReadGameMetaData["platform"][0] = {
      platformId: gameItem.GamePlatform.id,
      platformName: gameItem.GamePlatform.name,
      releaseDate: new Date(`${gameItem.releaseDate}`).toISOString(),
    };
    if (index !== 0 && gameItem.gameId === gameMetaData[index - 1].gameId) {
      result[result.length - 1].platform.push(platform);
      return;
    }
    return result.push({ game, platform: [platform] });
  });
  return result;
};

export const dbDeleteGameById = async (gameId: string) => {
  // delete game MetaData frist
  const game = await db.game.findUnique({ where: { id: gameId } });
  if (!game)
    throw new Response(null, {
      status: 404,
      statusText: "gam does not exist with provided id",
    });
  const s3Params = {
    Bucket: process.env.BUCKET_NAME,
    Key: game.imageUrl!,
  };
  const command = new DeleteObjectCommand(s3Params);
  try {
    const response = await s3Client.send(command);
  } catch (err) {
    // This error happens while deleteing s3 object
    console.log(err);
    throw new Response(null, {
      status: 500,
      statusText: "internal server error please try again",
    });
  }
  // do these transactions in a lock
  const deleteMetadata = db.gameMetaData.deleteMany({
    where: {
      gameId: gameId,
    },
  });
  const deleteGame = db.game.delete({
    where: {
      id: gameId,
    },
  });
  await db.$transaction([deleteMetadata, deleteGame]);
};

export const dbCreateUser = async (data: {
  email: string;
  password: string;
  userType: UserType;
  userName: string;
}) => {
  const { email, password, userType, userName } = data;
  // create password hash
  const hash = await bcrypt.hash(password, saltRounds);

  //create new user
  const user = await db.user.create({
    data: { email, passwordHash: hash, userType, userName: userName },
  });

  return user;
};

export const dbGetUserByEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      email: true,
      userName: true,
      userType: true,
      passwordHash: true,
    },
  });
  return user;
};

export const dbGetUserByUserName = async (userName: string) => {
  const user = await db.user.findUnique({
    where: {
      userName: userName,
    },
    select: {
      id: true,
      email: true,
      userName: true,
      userType: true,
      passwordHash: true,
    },
  });
  return user;
};

export const dbGetUserById = async (id: any) => {
  const user = await db.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      email: true,
      userName: true,
      userType: true,
    },
  });
  return user;
};
