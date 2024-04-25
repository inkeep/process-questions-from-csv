import z from 'zod';
import * as process from "node:process";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    INKEEP_ORGANIZATION_ID: z.string().min(1),
    INKEEP_INTEGRATION_ID: z.string().min(1),
    INKEEP_API_KEY: z.string().min(1),
    FILE_PATH:  z.string().min(1),
    SHARE_URL_BASE_PATH:z.string().min(1),
    CHAT_MODE:z.string().min(1),
    TAGS: z.string().min(1),
    CHAT_SESSION_ID: z.string().min(1),
});

const envServer = envSchema.safeParse({
    INKEEP_ORGANIZATION_ID: process.env.INKEEP_ORGANIZATION_ID,
    INKEEP_INTEGRATION_ID: process.env.INKEEP_INTEGRATION_ID,
    INKEEP_API_KEY: process.env.INKEEP_API_KEY,
    FILE_PATH:  process.env.FILE_PATH,
    SHARE_URL_BASE_PATH: process.env.SHARE_URL_BASE_PATH,
    CHAT_MODE: process.env.CHAT_MODE,
    TAGS: process.env.TAGS,
    CHAT_SESSION_ID: process.env.CHAT_SESSION_ID,
});

if (!envServer.success) {
    console.error(envServer.error.issues);
    process.exit(1);
}

export const envServerSchema = envServer.data;
