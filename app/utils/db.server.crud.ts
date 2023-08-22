import bcrypt from "bcryptjs";
import { UserType } from "@prisma/client";
import { db } from "./db.server";
import {
  DbAddGame,
  DbReadGameMetaData,
  DbEditGame,
  DbReadGameByYear,
} from "./types";
import { saltRounds } from "./session.server";
import {
  getEndOfCurrentMonth,
  getStartOfCurrentMonth,
  getStartOfYear,
  getEndOfYear,
  s3Client,
  getMonthNumber,
} from "~/utils";
import { MonthNames } from "./types";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const dbCreateGame = async (data: DbAddGame) => {
  const { title, description, platform, imageUrl, genre } = data;
  const parseGenre = genre.map((id) => ({ genreId: id }));
  const parsedPlatforms = platform.map((platform) => {
    return {
      gamePlatformId: platform.platformId,
      releaseDate: platform.releaseDate,
    };
  });

  return await db.game.create({
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

export const dbCreateMultipleGames = async (games: {
  [key: string]: DbAddGame;
}) => {
  const gamePromises = [];
  for (const property in games) {
    const { title, description, platform, imageUrl, genre } = games[property];
    const parseGenre = genre.map((id) => ({ genreId: id }));
    const parsedPlatforms = platform.map((platform) => {
      return {
        gamePlatformId: platform.platformId,
        releaseDate: platform.releaseDate,
      };
    });

    const game = db.game.create({
      data: {
        title: title,
        description: description,
        imageUrl: imageUrl,
        gameMetaData: {
          createMany: {
            data: parsedPlatforms,
          },
        },
        GameGenreFlatTable: {
          createMany: { data: parseGenre },
        },
      },
    });
    gamePromises.push(game);
  }
  await db.$transaction([...gamePromises]);
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
    orderBy: [
      {
        releaseDate: "asc",
      },

      {
        gameId: "asc",
      },
    ],
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
  const mappedGames = mapGameMetadata(gameMetaData);
  // const gamesSortedByDate = [...mappedGames];
  // gamesSortedByDate.sort((a, b) => {
  //   const date1: any = new Date(a.platform[0].releaseDate);
  //   const date2: any = new Date(b.platform[0].releaseDate);

  //   return date1 - date2;
  // });

  return mappedGames;
};

export const dbGetCurrentMonthGames = async () => {
  const startOfMonth = getStartOfCurrentMonth();
  const endOfMonth = getEndOfCurrentMonth();
  const gameMetaData = await db.gameMetaData.findMany({
    where: {
      AND: [
        {
          releaseDate: {
            gte: startOfMonth.toISOString(),
          },
        },
        { releaseDate: { lte: endOfMonth.toISOString() } },
      ],
    },
    orderBy: [
      {
        releaseDate: "asc",
      },

      {
        gameId: "asc",
      },
    ],
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
  const mappedGames = mapGameMetadata(gameMetaData);

  return mappedGames;
};

export const dbGetGameByYear = async (year: number) => {
  const startOfYear = getStartOfYear(year);

  const endOfYear = getEndOfYear(year);
  const gameMetaData = await db.gameMetaData.findMany({
    where: {
      AND: [
        {
          releaseDate: {
            gte: startOfYear.toISOString(),
          },
        },
        { releaseDate: { lte: endOfYear.toISOString() } },
      ],
    },
    orderBy: [
      {
        releaseDate: "asc",
      },

      {
        gameId: "asc",
      },
    ],
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
  const mappedGames = sortGameDataByMonth(gameMetaData, year);

  return mappedGames;
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

  const mappedGame = mapGameMetadata(gameMetaData);

  return mappedGame;
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

type mapGameMetaData = {
  id: string;
  releaseDate: Date;
  gameId: string;
  gamePlatformId: string;
  createdAt: Date;
  updatedAt: Date;
  game: {
    title: string;
    imageUrl: string | null;
    description: string | null;
  };
  GamePlatform: {
    id: string;
    name: string;
  };
};

const mapGameMetadata = (val: mapGameMetaData[]) => {
  const result: DbReadGameMetaData[] = [];
  val.forEach((gameItem, index) => {
    const game: DbReadGameMetaData["game"] = {
      ...gameItem.game,
      gameId: gameItem.gameId,
    };
    const platform: DbReadGameMetaData["platform"][0] = {
      platformId: gameItem.GamePlatform.id,
      platformName: gameItem.GamePlatform.name,
      releaseDate: new Date(`${gameItem.releaseDate}`).toISOString(),
    };
    if (index !== 0 && gameItem.gameId === val[index - 1].gameId) {
      result[result.length - 1].platform.push(platform);
      return;
    }
    return result.push({ game, platform: [platform] });
  });
  return result;
};

const sortGameDataByMonth = (val: mapGameMetaData[], year: number) => {
  const result: DbReadGameByYear = {
    year: year,
    [MonthNames.January]: [],
    [MonthNames.February]: [],
    [MonthNames.March]: [],
    [MonthNames.April]: [],
    [MonthNames.May]: [],
    [MonthNames.June]: [],
    [MonthNames.July]: [],
    [MonthNames.August]: [],
    [MonthNames.September]: [],
    [MonthNames.October]: [],
    [MonthNames.November]: [],
    [MonthNames.December]: [],
  };
  val.forEach((gameItem) => {
    const month = getMonthNumber(gameItem.releaseDate.toString());
    switch (true) {
      case month === 0:
        sortByMonth(MonthNames.January, gameItem, result);
        break;
      case month === 1:
        sortByMonth(MonthNames.February, gameItem, result);
        break;
      case month === 2:
        sortByMonth(MonthNames.March, gameItem, result);
        break;
      case month === 3:
        sortByMonth(MonthNames.April, gameItem, result);
        break;
      case month === 4:
        sortByMonth(MonthNames.May, gameItem, result);
        break;
      case month === 5:
        sortByMonth(MonthNames.June, gameItem, result);
        break;
      case month === 6:
        sortByMonth(MonthNames.July, gameItem, result);
        break;
      case month === 7:
        sortByMonth(MonthNames.August, gameItem, result);
        break;
      case month === 8:
        sortByMonth(MonthNames.September, gameItem, result);
        break;
      case month === 9:
        sortByMonth(MonthNames.October, gameItem, result);
        break;
      case month === 10:
        sortByMonth(MonthNames.November, gameItem, result);
        break;
      case month === 11:
        sortByMonth(MonthNames.December, gameItem, result);
        break;
    }
  });
  return result;
};

const sortByMonth = (
  month:
    | MonthNames.January
    | MonthNames.February
    | MonthNames.March
    | MonthNames.April
    | MonthNames.May
    | MonthNames.June
    | MonthNames.July
    | MonthNames.August
    | MonthNames.September
    | MonthNames.October
    | MonthNames.November
    | MonthNames.December,
  gameItem: mapGameMetaData,
  result: DbReadGameByYear
) => {
  const game: DbReadGameMetaData["game"] = {
    ...gameItem.game,
    gameId: gameItem.gameId,
  };
  const platform: DbReadGameMetaData["platform"][0] = {
    platformId: gameItem.GamePlatform.id,
    platformName: gameItem.GamePlatform.name,
    releaseDate: new Date(`${gameItem.releaseDate}`).toISOString(),
  };
  const monthArrayIndex = result[month][result[month].length - 1];
  if (
    result[month].length !== 0 &&
    gameItem.gameId === monthArrayIndex?.game.gameId
  ) {
    monthArrayIndex?.platform.push(platform);
    return;
  }
  result[month].push({ game, platform: [platform] });
  return;
};
