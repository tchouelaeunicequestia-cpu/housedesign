'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '../routing';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="flex items-center gap-2 bg-gray-900 p-1 rounded-lg border border-gray-800">
      <button
        onClick={() => handleLanguageChange('fr')}
        disabled={isPending}
        className={`px-3 py-1 rounded text-xs font-bold transition-all ${
          locale === 'fr' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        disabled={isPending}
        className={`px-3 py-1 rounded text-xs font-bold transition-all ${
          locale === 'en' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
}
