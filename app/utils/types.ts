import { z } from "zod";
import { BadRequestZod } from "./zod";

export type BadRequest = z.infer<typeof BadRequestZod>;
