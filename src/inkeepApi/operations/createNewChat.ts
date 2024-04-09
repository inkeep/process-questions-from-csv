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

export const createNewChat = async ({variables, options}:createNewChatInput): Promise<CreateResponse | {chatResult: {message: {content: string}, chatSessionId: string | null | undefined} }>=> {
    const sdk = new InkeepAI({
        apiKey: process.env.INKEEP_API_KEY,
    });

    const result = await sdk.chatSession.create(variables,options)

    if (variables.stream === true) {
        let chatSessionId: string | undefined | null = undefined;
        const messageArray = [];
        let content: string = "";
        for await (const event of result?.chatResultStream || []) {
            if (event.event == "message_chunk") {
                messageArray.push(event.data.contentChunk)
                content = messageArray.join('')
                chatSessionId = event.data.chatSessionId;
            }
        }
        return {chatResult:{ message:{content}, chatSessionId}}
}

return result
};
