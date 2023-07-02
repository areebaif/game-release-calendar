import { z } from "zod";
import { BadRequestZod, GamePlatformZod, PlatformDropDwonListZod, formPlatformFieldsZod } from "./zod";

export type BadRequest = z.infer<typeof BadRequestZod>;
export type GamePlatform = z.infer<typeof GamePlatformZod>;
export type FormPlatformFields = z.infer<typeof formPlatformFieldsZod>
export type PlatformDropDwonList = z.infer<typeof PlatformDropDwonListZod>