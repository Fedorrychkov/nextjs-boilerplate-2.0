'use client'

const isDevelopment = process.env.NEXT_PUBLIC_APP_ENV === 'development'
const isStage = process.env.NEXT_PUBLIC_APP_ENV === 'stage'

const isEnabled = isDevelopment || isStage

/**
 * Browser logger
 */
export const logger = {
  debug: (...args: any[]) => {
    if (isEnabled) {
      console.log(...args)
    }
  },
  error: (...args: any[]) => {
    if (isEnabled) {
      console.error(...args)
    }
  },
  info: (...args: any[]) => {
    if (isEnabled) {
      console.info(...args)
    }
  },
  warn: (...args: any[]) => {
    if (isEnabled) {
      console.warn(...args)
    }
  },
}
