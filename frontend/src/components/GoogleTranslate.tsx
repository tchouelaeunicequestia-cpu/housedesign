'use client';

import { Languages, ChevronDown } from 'lucide-react';
import { useGoogleTranslate } from './GoogleTranslateProvider';
import styles from './GoogleTranslate.module.css';

export default function GoogleTranslate() {
  const { language, languages, isReady, setLanguage } = useGoogleTranslate();

  return (
    <label className={styles.control}>
      <Languages className={styles.icon} aria-hidden="true" />
      <span className={styles.label}>Translate</span>
      <select
        aria-label="Translate this page"
        className={styles.select}
        value={language}
        disabled={!isReady}
        onChange={(event) => {
          setLanguage(event.target.value);
        }}
      >
        <option value="" disabled>
          {isReady ? 'Choose language' : 'Loading'}
        </option>
        {languages.map((availableLanguage) => (
          <option key={availableLanguage.code} value={availableLanguage.code}>
            {availableLanguage.name}
          </option>
        ))}
      </select>
      <ChevronDown className={styles.chevron} aria-hidden="true" />
    </label>
  );
}
