import { useSyncExternalStore } from 'react';

/**
 * Seasonal look of the website.
 * The server only sends a few allowed names (never CSS). This file turns those names into
 * colours, so a wrong or unexpected value can never break or hijack the page.
 */
export const TINT_COLORS = {
  'deep-blue': '#0a1f5c',
  'royal-blue': '#1e3a8a',
  'sky-blue': '#0c4a6e',
  indigo: '#1e1b4b',
} as const;

export const ACCENT_COLORS = {
  red: { base: '#dc2626', dark: '#b91c1c' },
  crimson: { base: '#be123c', dark: '#9f1239' },
  orange: { base: '#ea580c', dark: '#c2410c' },
} as const;

export type TintKey = keyof typeof TINT_COLORS;
export type AccentKey = keyof typeof ACCENT_COLORS;

export interface SiteTheme {
  name: string;
  season: string;
  tint: TintKey;
  tintOpacity: number;
  accent: AccentKey;
  banner: string;
}

const MIN_OPACITY = 0.4;
const MAX_OPACITY = 0.75;
const DRY_MONTHS = [11, 12, 1, 2, 3]; // November to March

/** The look used until (or unless) the server sends a theme. It follows the calendar. */
export function defaultTheme(date: Date = new Date()): SiteTheme {
  const dry = DRY_MONTHS.includes(date.getMonth() + 1);
  return dry
    ? {
        name: 'Dry season',
        season: 'dry',
        tint: 'deep-blue',
        tintOpacity: 0.5,
        accent: 'red',
        banner: 'Dry season is the best time to start building. Book a site visit today.',
      }
    : {
        name: 'Rainy season',
        season: 'rainy',
        tint: 'sky-blue',
        tintOpacity: 0.6,
        accent: 'red',
        banner: 'Planning ahead for the rains? Ask us about drainage and waterproofing.',
      };
}

/** Accepts whatever the server sent and returns a safe theme, or null if it is not usable. */
export function toSafeTheme(raw: unknown): SiteTheme | null {
  if (!raw || typeof raw !== 'object') return null;
  const input = raw as Record<string, unknown>;
  if (!(typeof input.tint === 'string' && input.tint in TINT_COLORS)) return null;
  if (!(typeof input.accent === 'string' && input.accent in ACCENT_COLORS)) return null;

  const opacity = Number(input.tintOpacity);
  return {
    name: typeof input.name === 'string' ? input.name.slice(0, 60) : '',
    season: typeof input.season === 'string' ? input.season.slice(0, 20) : 'custom',
    tint: input.tint as TintKey,
    tintOpacity: Number.isFinite(opacity) ? Math.min(MAX_OPACITY, Math.max(MIN_OPACITY, opacity)) : 0.55,
    accent: input.accent as AccentKey,
    banner: typeof input.banner === 'string' ? input.banner.slice(0, 140) : '',
  };
}

export function themeToCssVars(theme: SiteTheme): Record<string, string> {
  return {
    '--season-tint': TINT_COLORS[theme.tint],
    '--season-tint-opacity': String(theme.tintOpacity),
    '--season-accent': ACCENT_COLORS[theme.accent].base,
    '--season-accent-dark': ACCENT_COLORS[theme.accent].dark,
  };
}

// ---- a tiny shared store so any component can read the current theme ----

let current: SiteTheme | null = null;
const listeners = new Set<() => void>();

export function setSiteTheme(theme: SiteTheme) {
  current = theme;
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    Object.entries(themeToCssVars(theme)).forEach(([name, value]) => root.style.setProperty(name, value));
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The current theme, or null on the server and during the first render. */
export function useSiteTheme(): SiteTheme | null {
  return useSyncExternalStore(subscribe, () => current, () => null);
}
