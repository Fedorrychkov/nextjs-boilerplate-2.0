export const jsonParseSafety = <T>(value: string, reviver?: (this: any, key: string, value: any) => any): T | null => {
  try {
    if (!value) {
      return null
    }

    return JSON.parse(value, reviver) as T
  } catch (ex) {
    console.error('jsonParseSafety', ex)
    console.info('value: ', value)

    return null
  }
}

export const jsonStringifySafety = <T>(
  value: T,
  replacer?: (this: any, key: string, value: any) => any | (number | string)[] | null,
  space?: string | number,
): string | null => {
  try {
    return JSON.stringify(value, replacer, space)
  } catch (ex) {
    console.error('jsonStringifySafety', ex)
    console.info('value: ', value)

    return null
  }
}
