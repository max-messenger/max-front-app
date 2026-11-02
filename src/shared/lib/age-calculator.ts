function pluralYears(years: number): string {
  const mod10 = years % 10
  const mod100 = years % 100

  if (mod10 === 1 && mod100 !== 11) {
    return 'год'
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return 'года'
  }

  return 'лет'
}

export const getAge = (age: number): string => {
  const years = Math.floor(age / 12)
  const months = age % 12

  if (years === 0) {
    return `${months} мес`
  }

  return `${years} ${pluralYears(years)} ${months} мес`
}
