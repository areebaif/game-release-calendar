import bcrypt from "bcryptjs";
import { UserType } from "@prisma/client";
import { db } from "./db.server";
import { DbAddGame, DbReadGameMetaData } from "./types";
import { saltRounds } from "./session.server";
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

//   const hash = await bcrypt.hash(password, rounds)
// await bcrypt.compare(password, hash)
