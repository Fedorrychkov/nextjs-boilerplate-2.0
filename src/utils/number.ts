export const parseNumber = (value: string | null, isCanNegative = false) => {
  if (value === '' || value === null) return null

  const parsedValue = typeof value === 'string' ? value : String(value)

  const isNegative = parsedValue.startsWith('-')

  if (isCanNegative && isNegative) {
    if (parsedValue.length === 1) {
      return value
    }

    if (parsedValue.length === 2 && parsedValue === '-.') {
      return '-'
    }

    if (parsedValue.length === 2 && parsedValue === '-0') {
      return value
    }
  }

  const hasDotOrComma = parsedValue?.includes('.') || parsedValue?.includes(',')

  if (hasDotOrComma) {
    const replacedValue = parsedValue?.replace(/,/g, '.')
    const dotSize = replacedValue.split('.')?.length ?? 0

    if (dotSize > 2) {
      return null
    }

    const splitValue = replacedValue.split('.')

    if (dotSize > 0 && splitValue[1]?.length > 0) {
      if (splitValue[1] === '0') {
        return value
      }

      return Number.isNaN(Number(replacedValue)) ? null : Number.parseFloat(replacedValue)
    }

    return replacedValue
  }

  return Number.isNaN(Number(value)) ? null : Number.parseFloat(value)
}

export const parseNumberWithNegative = (value: string | null) => {
  return parseNumber(value, true)
}
