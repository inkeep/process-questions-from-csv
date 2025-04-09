import z from 'zod';
import * as process from "node:process";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    INKEEP_INTEGRATION_ID: z.string().optional().default('evaluation'),
    INKEEP_API_KEY: z.string().min(1),
    FILE_PATH:  z.string().min(1),
    SHARE_URL_BASE_PATH:z.string().min(1),
    CHAT_MODE: z.string().min(1).optional(),
    TAGS: z.string().min(1).optional(),
    BATCH_SIZE: z.string().optional().transform((value) => value ? Number.parseInt(value) : undefined).refine(value => value === undefined || !Number.isNaN(value), {
        message: "BATCH_SIZE must be a valid integer",
    }),
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
    console.log("Error parsing env variables");
    console.error(envServer.error.issues);
    process.exit(1);
}

export const env = envServer.data;
