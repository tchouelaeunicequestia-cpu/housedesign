import { getRequestConfig } from 'next-intl/server';

export const locales = ['fr', 'en'];
export const defaultLocale = 'fr';

export default getRequestConfig(async ({ locale }) => {
  let currentLocale = locale;
  if (!locales.includes(currentLocale as any)) {
    currentLocale = defaultLocale;
  }
  return {
    locale: currentLocale,
    messages: (await import(../messages/.json)).default,
  };
});
