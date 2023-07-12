import { db } from "./db.server";
import { DbAddGame } from "./types";

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
