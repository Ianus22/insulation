import OpenAI from 'openai';

const OPENAI = new OpenAI({
  apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY']
});

const THREAD_TIMEOUT = 60 * 1000;
const THREAD_TEMPERATURE = 0.3;

const VALIDATOR_TEMPLATE = (extraPrompt: string) =>
  `${extraPrompt}
  
  What is the best way to insulate and fireproof the area shown in the image given above?
`.trim();

const ASSISTANTS = {
  Insulation: 'asst_rhdahtQIBb3N3RsoTGBeIsdX',
  Validator: 'asst_hBw3ErAjfIS8izvJqMUc8LMd'
} as const;

export { OPENAI, THREAD_TIMEOUT, THREAD_TEMPERATURE, VALIDATOR_TEMPLATE, ASSISTANTS };
