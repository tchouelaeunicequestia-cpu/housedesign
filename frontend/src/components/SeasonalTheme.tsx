'use client';

import { useEffect } from 'react';
import api from '@/lib/api';
import { defaultTheme, setSiteTheme, toSafeTheme } from '@/lib/theme';

/** Applies the seasonal look: the calendar default first, then the theme approved in the admin area. */
export default function SeasonalTheme() {
  useEffect(() => {
    setSiteTheme(defaultTheme());

    let cancelled = false;
    api
      .get('/theme/active')
      .then((response) => {
        const theme = toSafeTheme(response.data);
        if (theme && !cancelled) setSiteTheme(theme);
      })
      .catch(() => {
        /* keep the default look if the server cannot be reached */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
