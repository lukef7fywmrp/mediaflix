import { TMDBWebAPI } from "tmdb-js-web";

const apiClient = new TMDBWebAPI({
  accessToken: process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN,
});

export default apiClient;
