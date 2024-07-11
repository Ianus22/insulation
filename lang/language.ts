import { createLocalization } from '@/hooks/localization';
import { en } from './en';
import { de } from './de';

const [languageState, useLocalization] = createLocalization({ en, de }, 'en');

languageState.listeners.add(() => localStorage.setItem('lang', languageState.value));

export { languageState, useLocalization };

