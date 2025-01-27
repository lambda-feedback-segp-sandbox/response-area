import { z } from 'zod'

export const trueFalseAnswerSchema = z
  .number() // legacy answer format (number), transformed to the new one (boolean)
  .transform(num => Boolean(num))
  .or(z.boolean())

export type TrueFalseAnswerSchema = z.infer<typeof trueFalseAnswerSchema>
