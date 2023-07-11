import { z } from "zod";

export const ImageUploadApiZod = z.object({
  fileName: z.string(),
  signedUrl: z.string(),
});
