const {
  NEXT_PUBLIC_APP_ENV = process.env.NEXT_PUBLIC_APP_ENV,
  CHAT_GPT_LLM_API_KEY = process.env.CHAT_GPT_LLM_API_KEY,
  APP_URL = process.env.APP_URL,
} = process.env

const isDevelop = NEXT_PUBLIC_APP_ENV === 'development'
const isStage = NEXT_PUBLIC_APP_ENV === 'stage'
const isProd = NEXT_PUBLIC_APP_ENV === 'production'

const APP_ENV = NEXT_PUBLIC_APP_ENV
const LLM_API_KEY = CHAT_GPT_LLM_API_KEY

export { LLM_API_KEY, APP_ENV, APP_URL, isDevelop, isProd, isStage }
