
import * as z from "zod";

export const imageSchema = z.object({
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Image must be less than 5MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type), 
      "Only jpeg, png, gif, webp are allowed"
    ),
});