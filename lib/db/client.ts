import { MONGODB_CONFIG } from '@config/env'
import mongoose from 'mongoose'

// Кэшируем соединение для переиспользования
type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongooseCache: MongooseCache | undefined
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null }

if (!global.mongooseCache) {
  global.mongooseCache = cached
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    // Формируем connection string
    const mongoUri =
      MONGODB_CONFIG.uri ||
      `mongodb://${MONGODB_CONFIG.user ? `${MONGODB_CONFIG.user}:${MONGODB_CONFIG.password}@` : ''}${MONGODB_CONFIG.host || 'localhost'}:${MONGODB_CONFIG.port || 27017}/${MONGODB_CONFIG.db || 'circle-test'}?authSource=admin`

    cached.promise = mongoose.connect(mongoUri, opts)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
