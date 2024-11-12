import { RealtimeClient } from '@openai/realtime-api-beta';
import { LOCAL_RELAY_SERVER_URL, OPENAI_API_KEY } from './core';

const client = new RealtimeClient(
  LOCAL_RELAY_SERVER_URL
    ? { url: LOCAL_RELAY_SERVER_URL }
    : {
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowAPIKeyInBrowser: true,
    }
);

export default client;