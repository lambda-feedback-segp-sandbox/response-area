import { z } from 'zod'

export const numberResponseAnswerSchema = z
  .number()
  .or(z.literal('').transform(() => null))
  .or(z.nan().transform(() => null))
