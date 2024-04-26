import { processCSV } from './processCSV';
import dotenv from 'dotenv';
import { env } from "./env";

dotenv.config();

const filePath = env.FILE_PATH;
const shareUrlBasePath = env.SHARE_URL_BASE_PATH;

(async () => {
    try {
        await processCSV(filePath, shareUrlBasePath);
    } catch (error) {
        console.error('An error occurred during processing:', error);
    }
})();
