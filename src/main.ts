import { processFromCSV } from './processCSV';
import dotenv from 'dotenv';
import { envServerSchema } from "./serverEnvSchema";

dotenv.config();

const filePath = envServerSchema.FILE_PATH;
const shareUrlBasePath = envServerSchema.SHARE_URL_BASE_PATH;

(async () => {
    try {
        await processFromCSV(filePath, shareUrlBasePath);
    } catch (error) {
        console.error('An error occurred during processing:', error);
    }
})();
