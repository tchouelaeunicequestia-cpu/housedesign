/**
 * Videos shown in the four-panel hero background on the home page.
 *
 * HOW TO CHANGE THE VIDEOS
 * 1. Put your video files in  frontend/public/videos/
 * 2. List them below (the path starts with /videos/).
 *
 * Tips:
 * - Use at least 5 videos. Four play at the same time; the extra ones are what
 *   rotate in, so with fewer than 5 nothing can change.
 * - Short clips (10-20 seconds), 720p or smaller, H.264 .mp4, no sound, under 3 MB
 *   each. Four videos play at once, so small files keep the site fast.
 * - The six abstract files listed here are generated samples. Replace them with the
 *   client's own footage (or royalty-free clips) when ready.
 */
export const HERO_VIDEOS: string[] = [
  '/videos/sample-abstract-1.mp4',
  '/videos/sample-abstract-2.mp4',
  '/videos/sample-abstract-3.mp4',
  '/videos/sample-abstract-4.mp4',
  '/videos/sample-abstract-5.mp4',
  '/videos/sample-abstract-6.mp4',
];

/** How long each panel keeps a video before it is swapped (one panel changes every 1/4 of this). */
export const HERO_VIDEO_INTERVAL_MS = 12000;
