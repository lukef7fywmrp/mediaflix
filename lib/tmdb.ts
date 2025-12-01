import { TMDBNodeApi } from "tmdb-js-node";

const api = new TMDBNodeApi({
  apiKey: process.env.TMDB_API_KEY,
  accessToken: process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN,
});

export default api;
