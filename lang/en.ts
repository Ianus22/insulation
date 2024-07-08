const en = {
  HowToUse: 'How to use?',
  PricingName: 'Pricing'
} as const;

type Translations = { [TKey in keyof typeof en]: string };

export type { Translations };
export { en };

