import OpenAI from 'openai';

const OPENAI = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']
});

const THREAD_TIMEOUT = 60 * 1000;
const THREAD_TEMPERATURE = 0.3;

const ASSISTANTS = {
  Insulation: 'asst_rhdahtQIBb3N3RsoTGBeIsdX'
} as const;

export { OPENAI, THREAD_TIMEOUT, THREAD_TEMPERATURE, ASSISTANTS };

