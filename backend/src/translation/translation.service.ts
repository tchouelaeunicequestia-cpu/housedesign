import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Translates a given text to both English and French.
   * Detects the source language or auto-translates to the other language.
   */
  async translatePair(
    text?: string,
  ): Promise<{ en: string; fr: string }> {
    if (!text || !text.trim()) {
      return { en: '', fr: '' };
    }

    const trimmed = text.trim();
    const isFrench = this.detectIsFrench(trimmed);

    try {
      if (isFrench) {
        const translatedEn = await this.translateText(trimmed, 'fr', 'en');
        return {
          fr: trimmed,
          en: translatedEn || trimmed,
        };
      } else {
        const translatedFr = await this.translateText(trimmed, 'en', 'fr');
        return {
          en: trimmed,
          fr: translatedFr || trimmed,
        };
      }
    } catch (error) {
      this.logger.warn(`Translation fallback used for: "${trimmed.slice(0, 30)}..."`);
      return {
        en: trimmed,
        fr: trimmed,
      };
    }
  }

  /**
   * Helper to perform online translation with fallback
   */
  async translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
    if (!text) return '';

    try {
      // 1. Google Translate API free web endpoint
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Translation HTTP error ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translatedSegments = data[0].map((item: any) => item[0]).filter(Boolean);
        return translatedSegments.join('');
      }
    } catch (err: any) {
      this.logger.debug(`Online translation error: ${err.message}`);
    }

    return text;
  }

  /**
   * Basic heuristic to detect French common stopwords & accent patterns
   */
  private detectIsFrench(text: string): boolean {
    const lower = text.toLowerCase();
    const frenchIndicators = [
      /\b(le|la|les|un|une|des|du|de|pour|avec|dans|sur|projet|maison|bâtiment|béton|travaux|chantier|conception|structurel|structure|ingénieur|résidentiel|commercial)\b/,
      /[éèêëàâîïôùûç]/,
    ];

    return frenchIndicators.some((regex) => regex.test(lower));
  }
}
