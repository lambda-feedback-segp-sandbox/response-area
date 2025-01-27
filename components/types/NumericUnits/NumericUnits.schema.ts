import { z } from 'zod'

export const numericUnitsResponseAnswerSchema = z.string().transform(val => {
  const spaceIndex = val.indexOf(' ')

  let numeric: string
  let unit: string

  // If there is a space or more spaces, assign the string before the first space to numeric and string after first space to unit
  // e.g. 10 N m => numeric = '10'; unit = 'N m'
  if (spaceIndex !== -1) {
    numeric = val.slice(0, spaceIndex)
    unit = val.slice(spaceIndex + 1)
  } else {
    // If there's no space, assign the entire string to numeric and set unit to an empty string
    numeric = val
    unit = ''
  }
  return { numeric, unit }
})
