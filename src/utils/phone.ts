export const parsePhone = (phone?: string | null) => {
  if (!phone) return ''

  // Убираем все нецифровые символы
  const digitsOnly = phone.replace(/\D/g, '')

  // Если номер пустой после очистки, возвращаем пустую строку
  if (!digitsOnly) return ''

  let normalizedPhone = digitsOnly

  // Если номер начинается с 8 (российский формат), заменяем на 7
  if (normalizedPhone.startsWith('8') && normalizedPhone.length === 11) {
    normalizedPhone = '7' + normalizedPhone.slice(1)
  }

  // Если номер имеет 10 цифр (без кода страны), добавляем 7
  if (normalizedPhone.length === 10) {
    normalizedPhone = '7' + normalizedPhone
  }

  // Форматируем российские/казахстанские номера (начинаются с 7, 11 цифр)
  if (normalizedPhone.startsWith('7') && normalizedPhone.length === 11) {
    const code = normalizedPhone.slice(1, 4) // код оператора (3 цифры)
    const part1 = normalizedPhone.slice(4, 7) // первая часть номера (3 цифры)
    const part2 = normalizedPhone.slice(7, 9) // вторая часть номера (2 цифры)
    const part3 = normalizedPhone.slice(9, 11) // третья часть номера (2 цифры)

    return `+7 (${code}) ${part1}-${part2}-${part3}`
  }

  // Если номер не соответствует формату, возвращаем очищенный номер
  return normalizedPhone
}
