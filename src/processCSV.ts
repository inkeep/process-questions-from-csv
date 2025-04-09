import * as fastcsv from "fast-csv";
import fs, { promises as fsPromises } from "node:fs";
import { removeCitations } from "./stripCitations";
import { env } from "./env";
import OpenAI from 'openai';
import { InkeepAnalytics } from "@inkeep/inkeep-analytics";

const BATCH_SIZE = env.BATCH_SIZE || 2;
const CONSECUTIVE_FAILURE_THRESHOLD = 2;

// Initialize OpenAI client
const client = new OpenAI({
  baseURL: 'https://api.inkeep.com/v1/',
  apiKey: env.INKEEP_API_KEY,
});

const getLogger = (name: string) => {
  return {
    info: (...data: unknown[]): void => console.info(name, ...data),
    error: (...data: unknown[]): void => console.error(name, ...data),
    log: (...data: unknown[]): void => console.log(name, ...data)
  };
};

const readCSV = (path: string): Promise<string[]> => {
  const readLogger = getLogger('[readCSV]');
  return new Promise((resolve, reject) => {
    const questions: string[] = [];
    fastcsv
      .parseFile(path, { headers: true })
      .on("data", (row) => {
        questions.push(row.question);
      })
      .on("end", (rowCount: number) => {
        readLogger.info(`Parsed ${rowCount} rows`);
        resolve(questions);
      })
      .on("error", (error) => reject(error));
  });
};

const getTags = (): string[] => {
  const tags = env.TAGS || "";
  return tags.split(",");
};

interface ProcessResult {
  question: string;
  answer: string;
  view_chat_url: string;
}

const processBatch = async (
  batch: string[],
  shareUrlBasePath: string,
  initialCount: number
): Promise<{
  results: ProcessResult[];
  failureCount: number;
  currentCount: number;
}> => {
  let failureCount = 0;
  const startingCount = initialCount;
  
  const promises = batch.map(async (question, index) => {
    const indexLogger = getLogger(`[${index + 1}]`);
    try {
      ;
      const tags = getTags();
      const analytics = new InkeepAnalytics();

      const res = await client.chat.completions.create({
        model: 'inkeep-qa-expert',
        messages: [{ role: 'user', content: question }],
        stream: false,
      });

      // Get the content from the response
      const content = res.choices[0]?.message?.content ?? "";
      const chatSessionId = res.id;
      const chatSessionLogger = getLogger(`[${chatSessionId}]`);
      const answer = removeCitations(content).replace(
        /"/g,
        '""' // for csv compatibility
      );
      
      const tagsQueryParam = tags.length ? `&tags=${tags.join(",")}` : "";
      const view_chat_url = `${shareUrlBasePath}?conversationId=${chatSessionId}${tagsQueryParam}`;

      chatSessionLogger.info("got response for chat");
      await analytics.conversations.log({
        apiIntegrationKey: env.INKEEP_API_KEY,
      },
      {
        id: chatSessionId,
        type: "openai",
        visibility: "public",
        messages: [
          {
            role: "user",
            content: question,
          },
          {
            role: "assistant",
            content: answer,
          },
        ],
      });

      chatSessionLogger.info("logged chat");
      return { question, answer, view_chat_url };
    } catch (error) {
      indexLogger.error("Error processing chat:", error);
      failureCount++;
      return null;
    }
  });

  const results = (await Promise.all(promises)).filter((r) => r !== null) as ProcessResult[];

  // Display chat URLs with incrementing numbers
  results.forEach((result, index) => {
    getLogger('').info(`${startingCount + index}. ${result.view_chat_url}`);
  });

  // Calculate the new count after processing this batch
  const newCount = startingCount + results.length;

  return { 
    results, 
    failureCount, 
    currentCount: newCount 
  };
};

const writeOutputToCSV = async (
  outputData: ProcessResult[], 
  count: number, 
  shareUrlBasePath: string
) => {
  const timestamp = Date.now();
  const outputPath = `./outputs/integration_${env.INKEEP_INTEGRATION_ID}-count_${count}-time_${timestamp}.csv`;
  const outputLogger = getLogger('[output]');
  await fsPromises.mkdir("./outputs", { recursive: true });

  fastcsv
    .write(outputData, { headers: true })
    .pipe(fs.createWriteStream(outputPath))
    .on("finish", () => {
      outputLogger.info("--Finished processing--");
      outputLogger.info(`Output written to ${outputPath}`);
      outputLogger.info(`Sandbox found at: ${shareUrlBasePath}?tags=${encodeURIComponent(getTags().join(","))}`);
    });
};

export const processCSV = async (
  filePath: string,
  shareUrlBasePath: string
) => {
  let questions = await readCSV(filePath);
  questions = questions.reverse(); // so that the sandbox shows in same order as csv
  const csvProcessLogger = getLogger('[csvProcess]');
  csvProcessLogger.info(`Processing ${questions.length} questions ...`);

  let count = 0;
  const outputData: ProcessResult[] = [];
  let currentCount = 1; // Start from 1

  while (questions.length) {
    const batch = questions.splice(0, BATCH_SIZE);
    const {
      results,
      failureCount,
      currentCount: updatedCount,
    } = await processBatch(batch, shareUrlBasePath, currentCount);

    if (failureCount > CONSECUTIVE_FAILURE_THRESHOLD) {
      csvProcessLogger.error(
        `Stopping execution due to exceeding failure threshold of ${CONSECUTIVE_FAILURE_THRESHOLD} in a single batch.`
      );
      break;
    }
    outputData.push(...results);
    count += results.length;
    currentCount = updatedCount;
  }

  csvProcessLogger.info("writing output to csv");
  await writeOutputToCSV(outputData, count, shareUrlBasePath);
};
