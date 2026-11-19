/**
 * Pure helpers for the AI content features (no framework imports, easy to test).
 * - prompts that keep the AI to the facts we give it
 * - safe parsing of the AI's answer
 * - the small, fixed set of "theme tokens" the AI is allowed to pick from
 */

export type Season = 'dry' | 'rainy';

export const TINT_KEYS = ['deep-blue', 'royal-blue', 'sky-blue', 'indigo'] as const;
export const ACCENT_KEYS = ['red', 'crimson', 'orange'] as const;
export type TintKey = (typeof TINT_KEYS)[number];
export type AccentKey = (typeof ACCENT_KEYS)[number];

export interface ThemeTokens {
  name: string;
  season: Season | 'custom';
  tint: TintKey;
  tintOpacity: number;
  accent: AccentKey;
  banner: string;
}

export const MIN_TINT_OPACITY = 0.4;
export const MAX_TINT_OPACITY = 0.75;

/** "11,12,1,2,3" -> [11,12,1,2,3]. Falls back to the default dry months. */
export function parseMonths(value?: string | null): number[] {
  const months = (value ?? '')
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 12);
  return months.length > 0 ? months : [11, 12, 1, 2, 3];
}

export function getSeason(date: Date, dryMonths: number[] = [11, 12, 1, 2, 3]): Season {
  return dryMonths.includes(date.getMonth() + 1) ? 'dry' : 'rainy';
}

export function defaultThemeForSeason(season: Season): ThemeTokens {
  return season === 'dry'
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

export function clip(text: unknown, max: number): string {
  return typeof text === 'string' ? text.trim().slice(0, max) : '';
}

/** Finds the first JSON object in a text answer (models sometimes add words around it). */
export function parseJsonObject(text: string | null | undefined): Record<string, unknown> | null {
  if (!text) return null;
  const start = text.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        try {
          const parsed = JSON.parse(text.slice(start, i + 1));
          return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

/** Turns the AI answer into { title, body }, even when it did not return JSON. */
export function toTitleAndBody(text: string | null | undefined): { title: string; body: string } | null {
  if (!text || !text.trim()) return null;

  const json = parseJsonObject(text);
  if (json) {
    const title = clip(json.title, 160);
    const body = clip(json.body, 4000);
    if (title && body) return { title, body };
  }

  const lines = text.trim().split('\n');
  const title = lines[0].replace(/^["'#*\s]+|["'*\s]+$/g, '').replace(/^title:\s*/i, '').slice(0, 160);
  const body = lines.slice(1).join('\n').trim().slice(0, 4000);
  return title && body ? { title, body } : null;
}

/** Forces whatever the AI sent into the allowed theme tokens. Anything unknown is replaced. */
export function sanitizeTheme(raw: unknown, fallbackSeason: Season): ThemeTokens {
  const base = defaultThemeForSeason(fallbackSeason);
  const input = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  const tint = (TINT_KEYS as readonly string[]).includes(input.tint as string) ? (input.tint as TintKey) : base.tint;
  const accent = (ACCENT_KEYS as readonly string[]).includes(input.accent as string)
    ? (input.accent as AccentKey)
    : base.accent;

  const opacityNumber = Number(input.tintOpacity);
  const tintOpacity = Number.isFinite(opacityNumber)
    ? Math.min(MAX_TINT_OPACITY, Math.max(MIN_TINT_OPACITY, opacityNumber))
    : base.tintOpacity;

  const season: Season | 'custom' = input.season === 'dry' || input.season === 'rainy' ? input.season : fallbackSeason;

  return {
    name: clip(input.name, 60) || base.name,
    season,
    tint,
    tintOpacity: Math.round(tintOpacity * 100) / 100,
    accent,
    banner: clip(input.banner, 140) || base.banner,
  };
}

const HOUSE_STYLE =
  'You write for House Design, a civil engineering and architecture firm in Cameroon. ' +
  'Use ONLY the facts you are given. Never invent client names, prices, dates, measurements, ' +
  'locations, awards or certifications. Write in clear, professional English. ' +
  'Plain text only: no markdown, no hashtags, no emojis.';

export interface PromptPair {
  system: string;
  user: string;
}

export function buildStoryPrompt(project: {
  title: string;
  description?: string | null;
  category?: string | null;
  status?: string | null;
}): PromptPair {
  return {
    system: HOUSE_STYLE,
    user:
      'Write a short public showcase post (2 short paragraphs, about 120 words) about this project.\n' +
      `Project title: ${clip(project.title, 200)}\n` +
      `Category: ${clip(project.category, 80) || 'not specified'}\n` +
      `Status: ${clip(project.status, 40) || 'not specified'}\n` +
      `Notes: ${clip(project.description, 1500) || 'none'}\n\n` +
      'If the notes are thin, stay general instead of inventing details.\n' +
      'Answer ONLY with JSON: {"title": "...", "body": "..."}',
  };
}

export function buildDesignPrompt(
  inspirations: { title: string; category?: string | null }[],
  season: Season,
): PromptPair {
  const list =
    inspirations
      .slice(0, 8)
      .map((p) => `- ${clip(p.title, 100)}${p.category ? ` (${clip(p.category, 40)})` : ''}`)
      .join('\n') || '- (no projects yet)';
  return {
    system: HOUSE_STYLE,
    user:
      'Propose ONE new house design concept for a client in Cameroon. This is an idea for discussion, ' +
      'not a finished project, so call it a "concept". Take inspiration from the type of work in the list below, ' +
      `and suit the ${season === 'dry' ? 'hot, dry and dusty' : 'hot and rainy'} climate ` +
      '(ventilation, shade, roof drainage, durable local materials). Give it a short name, then 2 short paragraphs: ' +
      'the idea and the main features. Do not give exact dimensions or prices.\n' +
      `Our existing projects:\n${list}\n\n` +
      'Answer ONLY with JSON: {"title": "...", "body": "..."}',
  };
}

export function buildThemePrompt(season: Season, currentName?: string | null): PromptPair {
  return {
    system:
      'You choose seasonal look settings for the website of House Design, a civil engineering firm in Cameroon. ' +
      'The brand colours are blue (primary), white (secondary) and red (tertiary). You may only pick from the allowed values.',
    user:
      `It is now the ${season} season. Current theme: ${clip(currentName, 60) || 'none'}.\n` +
      `Allowed "tint" values: ${TINT_KEYS.join(', ')}.\n` +
      `Allowed "accent" values: ${ACCENT_KEYS.join(', ')}.\n` +
      `"tintOpacity" is a number from ${MIN_TINT_OPACITY} to ${MAX_TINT_OPACITY}.\n` +
      '"banner" is one friendly sentence (max 120 characters) for visitors that fits the season and our services.\n' +
      'Answer ONLY with JSON: {"name": "...", "season": "' + season + '", "tint": "...", "tintOpacity": 0.5, "accent": "...", "banner": "..."}',
  };
}

export function buildImagePrompt(concept: { title: string; body: string }): string {
  return (
    `Architectural concept rendering of a modern tropical house in Cameroon: ${clip(concept.title, 120)}. ` +
    `${clip(concept.body, 300)} Photorealistic exterior view, natural daylight, landscaped garden. ` +
    'No text, no logos, no people.'
  );
}
