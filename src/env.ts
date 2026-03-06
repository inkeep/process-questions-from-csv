import * as process from "node:process";
import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
  INKEEP_API_KEY: z.string().min(1),
  FILE_PATH: z.string().min(1).default("./inputs/questions.csv"),
  TAGS: z
    .string()
    .optional()
    .transform((value) =>
      value
        ? value
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
    ),
  BATCH_SIZE: z.coerce
    .number()
    .min(1)
    .max(5, "BATCH_SIZE cannot be greater than 5")
    .default(2),
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  console.log("Error parsing env variables");
  console.error(envServer.error.issues);
  process.exit(1);
}

export const env = envServer.data;
