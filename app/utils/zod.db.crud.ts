import z from "zod";

export const DbAddGameZod = z.object({
  title: z.string(),
  description: z.string().optional(),
  // TODO: convert this to url
  imageUrl: z.string(),
  platform: z
    .object({
      platformId: z.string(),
      platformName: z.string(),
      releaseDate: z.string(),
    })
    .array(),
});

export const DbReadGameMetaDataZod = z
  .object({
    game: z.object({
      title: z.string(),
      description: z.string().nullable(),
      imageUrl: z.string().nullable(),
      gameId: z.string(),
    }),
    platform: z
      .object({
        platformName: z.string(),
        releaseDate: z.string(),
      })
      .array(),
  })
