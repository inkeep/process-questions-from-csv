import { gql } from '@urql/core';
import createInkeepClient from './helper/createInkeepClient';
import { setupTimeouts, clearResponseTimeout } from './helper/timeouts';
import type { NewChatSubscription, NewChatSubscriptionVariables } from '../generated/graphql';
import * as defaultValues from './helper/apiConsts';  // Import all constants

const NEW_CHAT_SUB = gql`
  subscription NewChat($input: NewSessionChatResultInput!) {
    newSessionChatResult(input: $input) {
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

const createNewChat = async (variables: NewChatSubscriptionVariables, apiKey?: string): Promise<NewChatSubscription['newSessionChatResult']> => {
  const client = createInkeepClient(apiKey);
  
  // Merging defaultValues with provided variables
  const vars = {
    input: {
      ...defaultValues,
      ...variables.input
    }
  };

  return new Promise((resolve, reject) => {
    const subscriptionClient = client.subscription<NewChatSubscription, NewChatSubscriptionVariables>(NEW_CHAT_SUB, vars);

    const subscription = subscriptionClient.subscribe(() => {}); // empty function since we'll handle the response below

    // Set up the timeouts
    const timeouts = setupTimeouts(reject, subscription);

    // Use the actual subscription
    subscriptionClient.subscribe((onResult) => {
      clearResponseTimeout(timeouts);

      if (!onResult || onResult.error) {
        console.error('Error in receiving the response:', onResult?.error); // Log the error
        reject(new Error('Error in receiving the response'));
        return;
      }

      if (onResult.data?.newSessionChatResult.isEnd) {
        resolve(onResult.data.newSessionChatResult);
      }
    });
  });
};

export default createNewChat;
