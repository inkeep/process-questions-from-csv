import * as fastcsv from "fast-csv";
import fs, { promises as fsPromises } from "node:fs";
import { removeCitations } from "./stripCitations";
import { env } from "./env";
import { InkeepAI } from "@inkeep/ai-api";
import { InkeepAnalytics } from "@inkeep/inkeep-analytics/dist/commonjs/sdk/sdk";

const BATCH_SIZE = env.BATCH_SIZE || 2;
const CONSECUTIVE_FAILURE_THRESHOLD = 2;

const readCSV = (path: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const questions: string[] = [];
    fastcsv
      .parseFile(path, { headers: true })
      .on("data", (row) => {
        questions.push(row.question);
      })
      .on("end", (rowCount: number) => {
        console.log(`Parsed ${rowCount} rows`);
        resolve(questions);
      })
      .on("error", (error) => reject(error));
  });
};

const getTags = (): string[] => {
  const tags = env.TAGS || "";
  return tags.split(",");
};

const processBatch = async (
  batch: string[],
  shareUrlBasePath: string,
  currentCount: number
) => {
  let failureCount = 0;
  const promises = batch.map(async (question) => {
    try {
      const tags = getTags();
      const sdk = new InkeepAI({
        apiKey: env.INKEEP_API_KEY,
      });
      const analytics = new InkeepAnalytics();

      const res = await sdk.chatSession.create({
        chatSession: {
          messages: [
            {
              content: question,
              role: "user",
            },
          ],
          tags: tags,
        },
        chatMode: env.CHAT_MODE,
        integrationId: env.INKEEP_INTEGRATION_ID,
        stream: false,
      });

      const chatResult = res.chatResult!;

      const answer = removeCitations(chatResult.message.content || "").replace(
        /"/g,
        '""' // for csv compatability
      );
      const tagsQueryParam = tags ? `&tags=${tags.join(",")}` : "";
      const view_chat_url = `${shareUrlBasePath}?chatId=${chatResult.chatSessionId}${tagsQueryParam}`;


      await analytics.conversations.log( {
        apiIntegrationKey: env.INKEEP_API_KEY,
      },
      {
        type: "openai",
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

  for (const result of results) {
    console.log(`${currentCount}. ${result.view_chat_url}`);
    currentCount++;
  }

  return { results, failureCount, currentCount };
};

const writeOutputToCSV = async (outputData: any[], count: number, shareUrlBasePath: string) => {
  const timestamp = Date.now();
  const outputPath = `./outputs/integration_${env.INKEEP_INTEGRATION_ID}-count_${count}-time_${timestamp}.csv`;

  await fsPromises.mkdir("./outputs", { recursive: true });

  fastcsv
    .write(outputData, { headers: true })
    .pipe(fs.createWriteStream(outputPath))
    .on("finish", () => {
      console.log("--Finished processing--");
      console.log(`Output written to ${outputPath}`);
      console.log(`Sandbox found at: ${shareUrlBasePath}?tags=${encodeURIComponent(getTags().join(","))}`);
    });
};

export const processCSV = async (
  filePath: string,
  shareUrlBasePath: string
) => {
  let questions = await readCSV(filePath);
  questions = questions.reverse(); // so that the sandbox shows in same order as csv

  console.log(`Processing ${questions.length} questions ...`);

  let count = 0;
  const outputData = [];
  let currentCount = 1; // Start from 1

  while (questions.length) {
    const batch = questions.splice(0, BATCH_SIZE);
    const {
      results,
      failureCount,
      currentCount: updatedCount,
    } = await processBatch(batch, shareUrlBasePath, currentCount);

    if (failureCount > CONSECUTIVE_FAILURE_THRESHOLD) {
      console.error(
        `Stopping execution due to exceeding failure threshold of ${CONSECUTIVE_FAILURE_THRESHOLD} in a single batch.`
      );
      break;
    }
    outputData.push(...results);
    count += results.length;
    currentCount = updatedCount;
  }

  await writeOutputToCSV(outputData, count, shareUrlBasePath);
};
