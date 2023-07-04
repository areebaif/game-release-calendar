import { z } from "zod";
import {
  AddGameFormFieldsZod,
  AddNewPlatformFieldsZod,
  ErrorFormFieldsZod,
  GamePlatformZod,
  PlatformDropDwonListZod,
  formPlatformFieldsZod,
} from "./zod";

export type GamePlatform = z.infer<typeof GamePlatformZod>;
export type FormPlatformFields = z.infer<typeof formPlatformFieldsZod>;
export type PlatformDropDwonList = z.infer<typeof PlatformDropDwonListZod>;
export type AddGameFormFields = z.infer<typeof AddGameFormFieldsZod>;
export type ErrorFormFields = z.infer<typeof ErrorFormFieldsZod>;
export type AddNewPlatformFields = z.infer<typeof AddNewPlatformFieldsZod>;
