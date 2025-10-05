import * as streamingAvailability from "streaming-availability";

const RAPID_API_KEY = process.env.RAPID_API_KEY;

const streamingClient = new streamingAvailability.Client(
  new streamingAvailability.Configuration({
    apiKey: RAPID_API_KEY,
  }),
);

export default streamingClient;
