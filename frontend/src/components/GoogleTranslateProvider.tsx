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
  hasError: boolean;
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
  const [hasError, setHasError] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    const googleWindow = window as GoogleTranslateWindow;
    let cancelled = false;
    let observer: MutationObserver | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const readLanguages = () => {
      const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (!select || select.options.length < 2) return false;

      const availableLanguages = Array.from(select.options)
        .filter((option) => option.value)
        .map((option) => ({ code: option.value, name: option.textContent || option.value }));

      setLanguages(availableLanguages);
      setLanguage(select.value);
      setIsReady(true);
      setHasError(false);
      if (timeoutId) clearTimeout(timeoutId);
      return true;
    };

    const initialize = () => {
      const TranslateElement = googleWindow.google?.translate?.TranslateElement;
      if (cancelled || initialized.current || !TranslateElement) {
        if (!TranslateElement) {
          console.warn('Google Translate loaded without its translation widget.');
          setHasError(true);
        }
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
        if (!cancelled) {
          console.warn('Unable to load the Google Translate script.');
          setHasError(true);
        }
      };
      document.body.appendChild(script);
    }

    // If the widget has not appeared after 15 seconds (blocked or offline), stop showing "Loading".
    timeoutId = setTimeout(() => {
      if (!cancelled && !document.querySelector('.goog-te-combo')) {
        console.warn('Google Translate did not respond in time.');
        setHasError(true);
      }
    }, 15000);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isReady || !language) return;

    const translateSelect = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (!translateSelect) {
      console.warn('Google Translate initialized without its language selector.');
      return;
    }

    translateSelect.value = language;
    translateSelect.dispatchEvent(new Event('change', { bubbles: true }));
  }, [isReady, language]);

  return (
    <GoogleTranslateContext.Provider value={{ language, languages, isReady, hasError, setLanguage }}>
      {children}
      <div id="google_translate_element" aria-hidden="true" />
    </GoogleTranslateContext.Provider>
  );
}
