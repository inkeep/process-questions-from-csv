import dotenv from "dotenv";
import { env } from "./env";
import { processCSV } from "./processCSV";

dotenv.config();

const filePath = env.FILE_PATH;

(async () => {
  try {
    await processCSV(filePath);
  } catch (error) {
    console.error("An error occurred during processing:", error);
  }
})();
