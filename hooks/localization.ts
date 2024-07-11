import { createGlobalState, useGlobalState } from './globalState';

type Translations<TLangs extends string, TKeys extends string> = {
  [TLang in TLangs]: {
    [TKey in TKeys]: string;
  };
};

function createLocalization<TLangs extends string, TKeys extends string, TLang extends TLangs>
(
  translations: Translations<TLangs, TKeys>,
  defaultLang: TLang
) {
  const languageState = createGlobalState<TLangs>(defaultLang);

  return [
    languageState,
    () => {
      const language = useGlobalState(languageState);

      return (key: TKeys) => translations[language.value][key] as string;
    }
  ] as const;
}

export { createLocalization };
export type { Translations };

