import { InkeepAnalytics } from "@inkeep/inkeep-analytics";
import { parseFile } from "fast-csv";
import OpenAI from "openai";
import { env } from "./env";

const BATCH_FAILURE_THRESHOLD = 2;

const client = new OpenAI({
  baseURL: "https://api.inkeep.com/v1",
  apiKey: env.INKEEP_API_KEY,
});
const inkeepAnalyticsClient = new InkeepAnalytics();

export async function readCSV(path: string): Promise<string[]> {
  const questions: string[] = [];

  const streamCSV = parseFile(path, { headers: true });

  for await (const row of streamCSV) {
    questions.push(row.question);
  }

  console.log(`Parsed ${questions.length} rows from CSV file`);
  return questions;
}

const conversationProperties =
  env.TAGS.length > 0 ? { tags: env.TAGS } : undefined;

async function askQuestionAndLog(question: string): Promise<string> {
  const res = await client.chat.completions.create({
    model: "inkeep-qa-expert",
    messages: [{ role: "user", content: question }],
    stream: false,
  });
  const answer = res.choices[0]?.message?.content ?? "";

  const analyticsRes = await inkeepAnalyticsClient.conversations.log(
    {
      apiIntegrationKey: env.INKEEP_API_KEY,
    },
    {
      type: "openai",
      properties: conversationProperties,
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
    },
  );
  // console.log(analyticsRes);
  return answer;
}

const processBatch = async (
  batch: string[],
  initialCount: number,
): Promise<{
  successCount: number;
  failureCount: number;
}> => {
  const results = await Promise.all(
    batch.map(async (question, index) => {
      try {
        console.log(
          `[${initialCount + index}] Asking question:`,
          question.slice(0, 200),
        );
        const answer = await askQuestionAndLog(question);
        console.log(`[${initialCount + index}] Answer:`, answer.slice(0, 200));
        return { question, answer };
      } catch (error) {
        console.error("Error processing question:", question, error);
        return null;
      }
    }),
  );

  const successCount = results.filter(Boolean).length;
  const failureCount = batch.length - successCount;

  return {
    successCount,
    failureCount,
  };
};

export const processCSV = async (filePath: string) => {
  const questions = await readCSV(filePath);

  let currentCount = 0;
  let totalSuccessCount = 0;
  let totalFailureCount = 0;

  // split questions into batches
  const batches = [];
  for (let i = 0; i < questions.length; i += env.BATCH_SIZE) {
    batches.push(questions.slice(i, i + env.BATCH_SIZE));
  }

  for (const batch of batches) {
    const { successCount, failureCount } = await processBatch(
      batch,
      currentCount,
    );

    totalSuccessCount += successCount;
    totalFailureCount += failureCount;

    if (failureCount >= BATCH_FAILURE_THRESHOLD) {
      console.error(
        `Stopping execution due to exceeding failure threshold of ${BATCH_FAILURE_THRESHOLD} in a single batch.`,
      );
      break;
    }

    currentCount += batch.length;

    console.log(
      `Batch complete: ${successCount} successes, ${failureCount} failures`,
    );
  }

  console.log(
    `Total processed: ${totalSuccessCount}, Total failures: ${totalFailureCount}`,
  );
};
