import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  let messages;
  switch (locale) {
    case 'fr':
      messages = (await import('../messages/fr.json')).default;
      break;
    case 'en':
    default:
      messages = (await import('../messages/en.json')).default;
      break;
  }

  return {
    locale,
    messages,
  };
});