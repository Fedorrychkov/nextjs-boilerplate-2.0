const {
  NEXT_PUBLIC_APP_ENV = process.env.NEXT_PUBLIC_APP_ENV,
  CHAT_GPT_LLM_API_KEY = process.env.CHAT_GPT_LLM_API_KEY,
  APP_URL = process.env.APP_URL,
  // MongoDB
  MONGODB_URI = process.env.MONGODB_URI,
  MONGODB_HOST = process.env.MONGODB_HOST,
  MONGODB_PORT = process.env.MONGODB_PORT,
  MONGODB_DB = process.env.MONGODB_DB,
  MONGODB_USER = process.env.MONGODB_USER,
  MONGODB_PASSWORD = process.env.MONGODB_PASSWORD,
  // JWT
  JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_ACCESS_EXPIRES_IN = Number(process.env.JWT_ACCESS_EXPIRES_IN || 3600), // 1 час
  JWT_REFRESH_EXPIRES_IN = Number(process.env.JWT_REFRESH_EXPIRES_IN || 15724800), // 21 дней
} = process.env

const isDevelop = NEXT_PUBLIC_APP_ENV === 'development'
const isStage = NEXT_PUBLIC_APP_ENV === 'stage'
const isProd = NEXT_PUBLIC_APP_ENV === 'production'

const APP_ENV = NEXT_PUBLIC_APP_ENV
const LLM_API_KEY = CHAT_GPT_LLM_API_KEY

// MongoDB config
const MONGODB_CONFIG = {
  uri: MONGODB_URI,
  host: MONGODB_HOST,
  port: MONGODB_PORT ? parseInt(MONGODB_PORT, 10) : 27017,
  db: MONGODB_DB,
  user: MONGODB_USER,
  password: MONGODB_PASSWORD,
}

// JWT config
const JWT_CONFIG = {
  secret: JWT_SECRET,
  accessExpiresIn: JWT_ACCESS_EXPIRES_IN,
  refreshExpiresIn: JWT_REFRESH_EXPIRES_IN,
}

export { APP_ENV, APP_URL, isDevelop, isProd, isStage, JWT_CONFIG, LLM_API_KEY, MONGODB_CONFIG }
