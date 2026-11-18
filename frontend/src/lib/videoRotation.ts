/**
 * Pure helpers that decide which video plays in which panel.
 *
 * Rules:
 * - a video is never shown in two panels at the same time;
 * - panels change one at a time, in order (1, 2, 3, 4, 1, ...);
 * - the video that leaves goes to the back of the waiting line;
 * - the video that comes in is the waiting one that THIS panel has not shown for the
 *   longest time, so every panel eventually plays every video, not just a small subset.
 */
export interface RotationState {
  panels: (string | null)[];
  queue: string[];
  nextPanel: number;
  tick: number;
  /** lastSeen[panel][video] = the tick when that video was last put in that panel. */
  lastSeen: Record<string, number>[];
}

export function shuffle<T>(items: readonly T[], rand: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createRotation(
  videos: readonly string[],
  panelCount: number,
  rand: () => number = Math.random,
): RotationState {
  const unique = shuffle(Array.from(new Set(videos)), rand);
  const panels: (string | null)[] = Array.from({ length: panelCount }, (_, i) => unique[i] ?? null);
  const lastSeen: Record<string, number>[] = panels.map((video) => (video ? { [video]: 0 } : {}));
  return { panels, queue: unique.slice(panelCount), nextPanel: 0, tick: 0, lastSeen };
}

/** Moves to the next video in the next panel. Returns the same state when nothing can change. */
export function stepRotation(state: RotationState): RotationState {
  if (state.queue.length === 0) return state;

  const panelIndex = state.nextPanel;
  const seenHere = state.lastSeen[panelIndex];

  // Pick the waiting video this panel has shown least recently (never shown = best).
  let best = 0;
  let bestScore = Infinity;
  state.queue.forEach((video, i) => {
    const score = seenHere[video] ?? -1;
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  });

  const incoming = state.queue[best];
  const rest = state.queue.filter((_, i) => i !== best);
  const outgoing = state.panels[panelIndex];
  const tick = state.tick + 1;

  const panels = [...state.panels];
  panels[panelIndex] = incoming;

  const lastSeen = state.lastSeen.map((entry, i) => (i === panelIndex ? { ...entry, [incoming]: tick } : entry));

  return {
    panels,
    queue: outgoing ? [...rest, outgoing] : rest,
    nextPanel: (panelIndex + 1) % panels.length,
    tick,
    lastSeen,
  };
}
