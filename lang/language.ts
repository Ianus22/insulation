import { createLocalization } from '@/hooks/localization';
import { en } from './en';
import { de } from './de';

const getInitialLanguage = () => {
  if (global.localStorage == null) return 'en';
  return localStorage.getItem('lang') ?? 'en';
};

const [languageState, useLocalization] = createLocalization({ en, de }, getInitialLanguage() as any);

languageState.listeners.add(() => localStorage.setItem('lang', languageState.value));

export { languageState, useLocalization };

