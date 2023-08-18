import z from "zod";
import { MonthNames } from "./types";

export const DbAddGameZod = z.object({
  title: z.string(),
  description: z.string().optional(),
  imageUrl: z.string(),
  platform: z
    .object({
      platformId: z.string(),
      platformName: z.string(),
      releaseDate: z.string(),
    })
    .array(),
});

export const DbEditGameZod = z.object({
  title: z.string(),
  gameId: z.string().uuid(),
  description: z.string().optional(),
  platform: z
    .object({
      platformId: z.string(),
      platformName: z.string(),
      releaseDate: z.string(),
    })
    .array(),
});

export const DbReadGameMetaDataZod = z.object({
  game: z.object({
    title: z.string(),
    description: z.string().nullable(),
    imageUrl: z.string().nullable(),
    gameId: z.string(),
  }),
  platform: z
    .object({
      platformId: z.string(),
      platformName: z.string(),
      releaseDate: z.string(),
    })
    .array(),
});

export const DbReadGameByYearZod = z.object({
  year: z.number(),
  [MonthNames.January]: DbReadGameMetaDataZod.optional().array(),
  [MonthNames.February]: DbReadGameMetaDataZod.optional().array(),
  [MonthNames.March]: DbReadGameMetaDataZod.optional().array(),
  [MonthNames.April]: DbReadGameMetaDataZod.optional().array(),
  [MonthNames.May]: DbReadGameMetaDataZod.optional().array(),
  [MonthNames.June]: DbReadGameMetaDataZod.optional().array(),
  [MonthNames.July]: DbReadGameMetaDataZod.optional().array(),
  [MonthNames.August]: DbReadGameMetaDataZod.optional().array(),
  [MonthNames.September]: DbReadGameMetaDataZod.optional().array(),
  [MonthNames.October]: DbReadGameMetaDataZod.optional().array(),
  [MonthNames.November]: DbReadGameMetaDataZod.optional().array(),
  [MonthNames.December]: DbReadGameMetaDataZod.optional().array(),
});
