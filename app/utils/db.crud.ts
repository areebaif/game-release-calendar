import { db } from "./db.server";
import { DbAddGame, DbReadGameMetaData } from "./types";
const bcrypt = require("bcryptjs");
import { UserType } from "@prisma/client";

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

export const DbGetAllGamesData = async () => {
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
  return gameMetaData;
};

const saltRounds = 10;
export const dbCreateUser = async (
  email: string,
  password: string,
  userType: UserType
) => {
  // create password hash
  const salt = bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  // create new user
  // const user = await db.user.create({
  //   data: { email, passwordHash: hash, userType },
  // });
  //console.log(user, "sjsjsjsjsjsjsjsjssj");
};
