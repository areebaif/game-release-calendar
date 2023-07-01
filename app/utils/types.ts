import { z } from "zod";
import { BadRequestZod, GamePlatformZod, PlatformReleaseListZod } from "./zod";

export type BadRequest = z.infer<typeof BadRequestZod>;
export type GamePlatform = z.infer<typeof GamePlatformZod>;
export type PlatformReleaseList = z.infer<typeof PlatformReleaseListZod>