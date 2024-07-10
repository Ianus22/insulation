import { createLocalization } from '@/hooks/localization';
import { en } from './en';
import { de } from './de';

const [languageState, useLocalization] = createLocalization({ en, de }, 'en');

export { languageState, useLocalization };

