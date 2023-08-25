import WebSocket, { Data } from 'ws';
import { createClient, fetchExchange, subscriptionExchange, Client, Exchange } from '@urql/core';
import { createClient as createWSClient, ClientOptions } from 'graphql-ws';
import dotenv from 'dotenv';

dotenv.config();

const getApiKey = (overrideApiKey?: string): string => {
  if (overrideApiKey) {
    return overrideApiKey;
  }

  const apiKey = process.env.INKEEP_API_KEY;

  if (!apiKey) {
    throw new Error('INKEEP_API_KEY environment variable is not defined, and no override API key was provided.');
  }

  return apiKey;
}

const createAuthorizationHeader = (apiKey: string): string => `Bearer ${apiKey}`;

const createInkeepClient = (overrideApiKey?: string): Client => {
  const apiKey = getApiKey(overrideApiKey);
  const authorizationHeader = createAuthorizationHeader(apiKey);

  const headersForWs: ClientOptions['connectionParams'] = {
    headers: {
      Authorization: authorizationHeader,
    },
    Authorization: authorizationHeader,
  };

  const wsClient = createWSClient({
    url: 'wss://api.inkeep.com/graphql',
    webSocketImpl: WebSocket as any,
    connectionParams: headersForWs,
  });

  return createClient({
    url: 'https://api.inkeep.com/graphql',
    exchanges: [
      fetchExchange,
      subscriptionExchange({
        forwardSubscription: request => ({
          subscribe: sink => {
            const unsubscribeCallback = wsClient.subscribe(
              { ...request, query: request.query || '' },
              sink,
            );

            return {
              unsubscribe: unsubscribeCallback
            };
          },
        }),
      }),
    ],
    fetchOptions: {
      headers: {
        Authorization: authorizationHeader
      },
    },
  });
};

export default createInkeepClient;