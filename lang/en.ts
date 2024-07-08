const en = {
  HowToUse: 'How to use?'
} as const;

type Translations = { [TKey in keyof typeof en]: string };

export type { Translations };
export { en };

