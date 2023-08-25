import { processFromCSV } from './processCSV';
import dotenv from 'dotenv';

dotenv.config();


if (!process.env.FILE_PATH || !process.env.SHARE_URL_BASE_PATH) {
  throw new Error("Environment variables FILE_PATH and/or SHARE_URL_BASE_PATH are not defined.");
}

const filePath = process.env.FILE_PATH;
const shareUrlBasePath = process.env.SHARE_URL_BASE_PATH;

(async () => {
    try {
        await processFromCSV(filePath, shareUrlBasePath);
    } catch (error) {
        console.error('An error occurred during processing:', error);
    }
})();