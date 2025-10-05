import * as streamingAvailability from "streaming-availability";

const RAPID_API_KEY = process.env.RAPID_API_KEY;

if (!RAPID_API_KEY) {
  throw new Error(
    "RAPID_API_KEY environment variable is required but not set. Please add it to your environment variables.",
  );
}

const streamingClient = new streamingAvailability.Client(
  new streamingAvailability.Configuration({
    apiKey: RAPID_API_KEY,
  }),
);

export default streamingClient;
