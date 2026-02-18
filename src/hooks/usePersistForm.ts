'use client'

import { useEffect } from 'react'

import { jsonStringifySafety } from '~/utils/jsonSafe'

export const usePersistForm = ({ value, localStorageKey, enabled = true }: { value: unknown; localStorageKey: string; enabled?: boolean }) => {
  useEffect(() => {
    if (value && enabled) {
      const stringifiedValue = jsonStringifySafety(value)

      if (stringifiedValue) {
        localStorage.setItem(localStorageKey, stringifiedValue)
      }
    }
  }, [value, localStorageKey, enabled])

  return
}
