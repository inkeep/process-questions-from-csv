import * as fastcsv from "fast-csv";
import fs, { promises as fsPromises } from "fs";
import { createNewChat } from "./inkeepApi/operations/createNewChat";
import { removeCitations } from "./stripCitations";

const BATCH_SIZE = 5;
const CONSECUTIVE_FAILURE_THRESHOLD = 2; // Adjust this value as needed

const readCSV = (path: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        const questions: string[] = [];
        fastcsv.parseFile(path, { headers: true })
            .on('data', (row) => {
                questions.push(row.question);
            })
            .on('end', (rowCount: number) => {
                console.log(`Parsed ${rowCount} rows`);
                resolve(questions);
            })
            .on('error', (error) => reject(error));
    });
};

const processBatch = async (batch: string[], shareUrlBasePath: string) => {
  let failureCount = 0;
  const promises = batch.map(async (question) => {
    try {
      const chatResult = await createNewChat({
        input: { messageInput: question },
      });
      const answer = removeCitations(chatResult.message.content);
      const view_chat_url = `${shareUrlBasePath}?chatId=${chatResult.sessionId}`;
      return { question, answer, view_chat_url };
    } catch (error) {
      console.error("Error processing chat:", error);
      failureCount++;
      return null;
    }
  });

  const results = (await Promise.all(promises)).filter((r) => r !== null) as {
    question: string;
    answer: string;
    view_chat_url: string;
  }[];

  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.view_chat_url}`);
  });

  return { results, failureCount };
};

export const processFromCSV = async (
  filePath: string,
  shareUrlBasePath: string
) => {
  const questions = await readCSV(filePath);

  let count = 0;
  const outputData = [];

  console.log(`Processing ${questions.length} questions ...`);
  while (questions.length) {
    const batch = questions.splice(0, BATCH_SIZE);
    const { results, failureCount } = await processBatch(batch, shareUrlBasePath);
    if (failureCount > CONSECUTIVE_FAILURE_THRESHOLD) {
      console.log(`Stopping execution due to exceeding failure threshold of ${CONSECUTIVE_FAILURE_THRESHOLD} in a single batch.`);
      break;
    }
    outputData.push(...results);
    count += results.length;
  }

  const timestamp = Date.now();
  const outputPath = `./outputs/output_${count}_${timestamp}.csv`;

  await fsPromises.mkdir("./outputs", { recursive: true });

  fastcsv
    .write(outputData, { headers: true })
    .pipe(fs.createWriteStream(outputPath))
    .on("finish", () => console.log(`Output written to ${outputPath}`));
};
