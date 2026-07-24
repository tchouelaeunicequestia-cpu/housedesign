'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      let newPath = pathname;
      if (locale === 'fr' && newLocale === 'en') {
        newPath = \/en\\;
      } else if (locale === 'en' && newLocale === 'fr') {
        newPath = pathname.replace('/en', '') || '/';
      }
      router.push(newPath);
    });
  };

  return (
    <div className="flex items-center gap-2 bg-gray-900 p-1 rounded-lg border border-gray-800">
      <button
        onClick={() => handleLanguageChange('fr')}
        disabled={isPending}
        className={\px-3 py-1 rounded text-xs font-bold transition-all \\}
      >
        FR
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        disabled={isPending}
        className={\px-3 py-1 rounded text-xs font-bold transition-all \\}
      >
        EN
      </button>
    </div>
  );
}
