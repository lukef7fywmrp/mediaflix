# MediaFlix

A modern movie and TV show discovery app built with Next.js, Convex, and Clerk.

## Features

- Top 10 rated movies and TV shows from TMDB
- Beautiful, responsive UI with dark mode support
- Real-time data from The Movie Database (TMDB)
- User authentication with Clerk
- Server-side rendering with Next.js

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Convex (database and server logic)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **Data Source**: The Movie Database (TMDB) API

## Get Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file
   - Add your TMDB API key and access token
   - Add your Convex deployment URL
   - Add your Clerk keys

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_url
TMDB_API_KEY=your_tmdb_api_key
TMDB_API_READ_ACCESS_TOKEN=your_tmdb_access_token
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_JWT_ISSUER_DOMAIN=your_clerk_jwt_issuer_domain
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [TMDB API Documentation](https://developers.themoviedb.org/)
