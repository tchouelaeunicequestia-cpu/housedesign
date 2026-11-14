'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface TranslationLanguage {
  code: string;
  name: string;
}

interface GoogleTranslateContextValue {
  language: string;
  languages: TranslationLanguage[];
  isReady: boolean;
  setLanguage: (language: string) => void;
}

interface GoogleTranslateWindow extends Window {
  google?: {
    translate?: {
      TranslateElement?: new (
        options: {
          pageLanguage: string;
          autoDisplay: boolean;
        },
        elementId: string,
      ) => unknown;
    };
  };
  googleTranslateElementInit?: () => void;
}

const GoogleTranslateContext = createContext<GoogleTranslateContextValue | null>(null);

export function useGoogleTranslate() {
  const context = useContext(GoogleTranslateContext);
  if (!context) {
    throw new Error('useGoogleTranslate must be used within GoogleTranslateProvider');
  }

  return context;
}

export default function GoogleTranslateProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('');
  const [languages, setLanguages] = useState<TranslationLanguage[]>([]);
  const [isReady, setIsReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    const googleWindow = window as GoogleTranslateWindow;
    let cancelled = false;
    let observer: MutationObserver | undefined;

    const readLanguages = () => {
      const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (!select || select.options.length < 2) return false;

      const availableLanguages = Array.from(select.options)
        .filter((option) => option.value)
        .map((option) => ({ code: option.value, name: option.textContent || option.value }));

      setLanguages(availableLanguages);
      setLanguage(select.value);
      setIsReady(true);
      return true;
    };

    const initialize = () => {
      const TranslateElement = googleWindow.google?.translate?.TranslateElement;
      if (cancelled || initialized.current || !TranslateElement) {
        if (!TranslateElement) console.error('Google Translate loaded without its translation widget.');
        return;
      }

      initialized.current = true;
      new TranslateElement(
        { pageLanguage: 'en', autoDisplay: false },
        'google_translate_element',
      );

      if (!readLanguages()) {
        observer = new MutationObserver(() => {
          if (readLanguages()) observer?.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    };

    googleWindow.googleTranslateElementInit = initialize;

    if (googleWindow.google?.translate?.TranslateElement) {
      initialize();
    } else if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = () => {
        if (!cancelled) console.error('Unable to load the Google Translate script.');
      };
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isReady || !language) return;

    const translateSelect = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (!translateSelect) {
      console.error('Google Translate initialized without its language selector.');
      return;
    }

    translateSelect.value = language;
    translateSelect.dispatchEvent(new Event('change', { bubbles: true }));
  }, [isReady, language]);

  return (
    <GoogleTranslateContext.Provider value={{ language, languages, isReady, setLanguage }}>
      {children}
      <div id="google_translate_element" aria-hidden="true" />
    </GoogleTranslateContext.Provider>
  );
}
