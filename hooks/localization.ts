import { createGlobalState, useGlobalState } from './globalState';
import { useEffect } from 'react';

type Translations<TLangs extends string, TKeys extends string> = {
  [TLang in TLangs]: {
    [TKey in TKeys]: string;
  };
};

function createLocalization<TLangs extends string, TKeys extends string, TLang extends TLangs>(
  translations: Translations<TLangs, TKeys>,
  defaultLang: TLang
) {
  const languageState = createGlobalState<TLangs>(defaultLang);

  languageState.listeners.add(() => localStorage.setItem('lang', languageState.value));

  return [
    languageState,
    () => {
      const language = useGlobalState(languageState);

      useEffect(() => {
        language.value = (localStorage.getItem('lang') as any) ?? 'en';
      }, []);

      return (key: TKeys) => translations[language.value][key] as string;
    }
  ] as const;
}

export { createLocalization };
export type { Translations };

