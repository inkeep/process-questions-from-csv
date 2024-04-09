import {InkeepAI} from "@inkeep/ai-api";
import * as process from "node:process";

import {
  ContinueChatSessionWithChatResultInput
} from "@inkeep/ai-api/src/models/components/continuechatsessionwithchatresultinput";
import {RequestOptions} from "@inkeep/ai-api/src/lib/sdks";
import {ContinueAcceptEnum} from "@inkeep/ai-api/src/sdk/chatsession";

type continueChatSessionInput= {
  chatSessionId: string;
  variables: ContinueChatSessionWithChatResultInput;
  options?: RequestOptions & { acceptHeaderOverride?: ContinueAcceptEnum }
}

export const continueExistingChat = async ({chatSessionId, variables, options }:continueChatSessionInput) => {
  const sdk = new InkeepAI({
    apiKey: process.env.INKEEP_API_KEY,
  });

  return await sdk.chatSession.continue(chatSessionId, variables, options)
}
