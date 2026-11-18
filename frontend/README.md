This is the frontend for the House Design application, built with [Next.js](https://nextjs.org).

## Getting Started

From the `frontend` directory, install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the app. The development server uses port **3001**. Pages use regular routes such as `/portfolio` and `/login` (there are no locale prefixes). Use the **Translate** selector in the page header to choose from Google Translate's available languages.

The development server automatically rebuilds as you edit files.

## Production

`npm run start` runs the app in production mode and requires a production build first. Build and start the app with:

```bash
npm run build
npm run start
```

The production server is available at [http://localhost:3001](http://localhost:3001).


## Home page video background

The hero on the home page is split into four panels. Each panel plays a different muted video, and the videos change one panel at a time without repeating on screen.

To use your own videos, put them in `frontend/public/videos/` and list them in `frontend/src/lib/heroVideos.ts`. Use at least 5 short clips (10-20 seconds, 720p or smaller, `.mp4`, no sound, under 3 MB each). The six `sample-abstract-*.mp4` files are generated placeholders that you can delete once you have real footage.
