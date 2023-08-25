import { gql } from "@urql/core";
import createInkeepClient from "./helper/createInkeepClient";
import type {
  ContinueExistingChatSubscription,
  ContinueExistingChatSubscriptionVariables,
} from "../generated/graphql";
import { setupTimeouts, clearResponseTimeout } from "./helper/timeouts";

const CONTINUE_EXISTING_CHAT_SUB = gql`
  subscription ContinueExistingChat($input: ContinueChatResultInput!) {
    continueChatResult(input: $input) {
      isEnd
      message {
        content
        id
        citations {
          title
          url
        }
      }
      sessionId
    }
  }
`;

const continueExistingChat = async (
  variables: ContinueExistingChatSubscriptionVariables,
  apiKey?: string
): Promise<ContinueExistingChatSubscription["continueChatResult"]> => {
  const client = createInkeepClient(apiKey);
  return new Promise((resolve, reject) => {
    const subscriptionClient = client.subscription<
      ContinueExistingChatSubscription,
      ContinueExistingChatSubscriptionVariables
    >(CONTINUE_EXISTING_CHAT_SUB, variables);

    const subscription = subscriptionClient.subscribe((onResult) => {});

    const timeouts = setupTimeouts(reject, subscription);

    subscriptionClient.subscribe((onResult) => {
      clearResponseTimeout(timeouts);

      if (!onResult || onResult.error) {
        console.error(
          "Error in receiving the response:",
          onResult?.error
        ); // Log the error
        reject(new Error("Error in receiving the response"));
        return;
      }

      if (onResult.data?.continueChatResult.isEnd) {
        resolve(onResult.data.continueChatResult);
      }
    });
  });
};

export default continueExistingChat;
