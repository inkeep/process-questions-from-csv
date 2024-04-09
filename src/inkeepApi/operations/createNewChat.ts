import {InkeepAI} from "@inkeep/ai-api";
import {CreateResponse} from "@inkeep/ai-api/models/operations";
import * as components from "@inkeep/ai-api/src/models/components";
import {RequestOptions} from "@inkeep/ai-api/src/lib/sdks";
import {CreateAcceptEnum} from "@inkeep/ai-api/src/sdk/chatsession";
import * as process from "node:process";

type createNewChatInput = {
    variables:components.CreateChatSessionWithChatResultInput;
    options?: RequestOptions & { acceptHeaderOverride?: CreateAcceptEnum }
}

export const createNewChat = async ({variables, options}:createNewChatInput): Promise<CreateResponse>=> {
    const sdk = new InkeepAI({
        apiKey: process.env.INKEEP_API_KEY,
    });

    return await sdk.chatSession.create(variables,options)
};
