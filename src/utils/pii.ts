/**
 * Замена PII в тексте на тег <spoiler>pii</spoiler> для последующего отображения спойлером на клиенте.
 * Проверки — только regex, без блокировки стрима.
 */

const SPOILER_TAG = '<spoiler>pii</spoiler>'

/** Email: local@domain.tld */
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g

/** Телефоны: +7..., +1 (123)..., 8 (999)..., 10+ цифр с пробелами/дефисами/скобками */
const PHONE_REGEX = /(?:\+\d{1,4}[\s\-()]*\d|[\d8][\s\-()]*\d)(?:[\d\s\-()]{8,})/g

/** Карточки: 4 группы по 4 цифры (Visa/MC и т.д.) или 4-4-4-4 */
const CARD_REGEX = /\b(?:\d{4}[\s\-]?){3}\d{4}\b/g

const PATTERNS: RegExp[] = [EMAIL_REGEX, PHONE_REGEX, CARD_REGEX]

/**
 * Заменяет обнаруженные PII в строке на тег <spoiler>pii</spoiler>.
 * Вызывается синхронно по накопленному fullContent при каждом чанке стрима.
 */
export function replacePii(text: string): string {
  let result = text

  for (const re of PATTERNS) {
    result = result.replace(re, SPOILER_TAG)
  }

  return result
}

export const PII_SPOILER_TAG = SPOILER_TAG
