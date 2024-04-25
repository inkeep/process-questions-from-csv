import * as fastcsv from "fast-csv";
import fs, { promises as fsPromises } from "fs";
import { createNewChat } from "./inkeepApi/operations/createNewChat";
import { removeCitations } from "./stripCitations";
/*import {continueExistingChat} from "./inkeepApi/operations/continueExistingChat";*/
import * as process from "node:process";
import * as defaultValues from "./inkeepApi/operations/helper/apiConsts";

const BATCH_SIZE = 3;
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

const getTags = (): string[] | undefined => {
  const tags = process.env.tags;
  if (!tags) return undefined;
  const tagList = tags.split(",");
  const isValid = tagList.every((tag) => typeof tag === "string");
  return isValid ? tagList : undefined;
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
      const chatResult = await createNewChat({
        variables: {
          chatSession: {
            messages: [
              {
                content: question,
                role: "user",
              },
            ],
          },
          chatMode: process.env.CHAT_MODE,
          integrationId: defaultValues.integrationId || "",
          stream: false,
        },
      });
      const answer = removeCitations(
        chatResult.chatResult?.message.content || ""
      );
      const tagsQueryParam = tags ? `&tags=${tags.join(",")}` : "";
      const view_chat_url = `${shareUrlBasePath}?chatId=${chatResult.chatResult?.chatSessionId}${tagsQueryParam}`;
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

  results.forEach((result) => {
    console.log(`${currentCount}. ${result.view_chat_url}`);
    currentCount++;
  });

  return { results, failureCount, currentCount };
};

export const processFromCSV = async (
  filePath: string,
  shareUrlBasePath: string
) => {
  const questions = await readCSV(filePath);

  let count = 0;
  const outputData = [];
  let currentCount = 1; // Start from 1

  console.log(`Processing ${questions.length} questions ...`);
  while (questions.length) {
    const batch = questions.splice(0, BATCH_SIZE);
    const {
      results,
      failureCount,
      currentCount: updatedCount,
    } = await processBatch(batch, shareUrlBasePath, currentCount);
    if (failureCount > CONSECUTIVE_FAILURE_THRESHOLD) {
      console.log(
        `Stopping execution due to exceeding failure threshold of ${CONSECUTIVE_FAILURE_THRESHOLD} in a single batch.`
      );
      break;
    }
    outputData.push(...results);
    count += results.length;
    currentCount = updatedCount;
  }

  const timestamp = Date.now();
  const orgId = process.env.INKEEP_ORGANIZATION_ID;
  const integrationId = process.env.INKEEP_INTEGRATION_ID;
  const outputPath = `./outputs/orgId_${orgId}_integrationId_${integrationId}_output_${count}_${timestamp}.csv`;

  await fsPromises.mkdir("./outputs", { recursive: true });

  fastcsv
    .write(outputData, { headers: true })
    .pipe(fs.createWriteStream(outputPath))
    .on("finish", () => console.log(`Output written to ${outputPath}`));
};
