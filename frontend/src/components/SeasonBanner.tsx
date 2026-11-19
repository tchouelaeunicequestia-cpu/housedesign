'use client';

import { useSiteTheme } from '@/lib/theme';

/** A slim seasonal message at the very top of the page. */
export default function SeasonBanner() {
  const theme = useSiteTheme();
  if (!theme || !theme.banner) return null;

  return (
    <div
      className="px-4 py-1.5 text-center text-xs font-medium text-white"
      style={{ backgroundColor: 'var(--season-accent, #dc2626)' }}
    >
      {theme.banner}
    </div>
  );
}
