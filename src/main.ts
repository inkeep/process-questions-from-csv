import { processFromCSV } from './processCSV'; // Adjust the path if needed

const filePath = 'inputs/questions.csv';  // Replace with your input CSV file path
const shareUrlBasePath = 'https://share.inkeep.com/inkeep/d80e8eba3748';

(async () => {
    try {
      console.log("running script");
        await processFromCSV(filePath, shareUrlBasePath);
        console.log('Processing completed.');
    } catch (error) {
        console.error('An error occurred during processing:', error);
    }
})();