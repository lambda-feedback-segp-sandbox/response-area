import { z } from 'zod'

export const expressionConfigSchema = z.object({
  allowHandwrite: z.boolean(),
  allowPhoto: z.boolean(),
})

export type ExpressionConfigSchema = z.infer<typeof expressionConfigSchema>

export const expressionAnswerSchema = z.string()

export type ExpressionAnswerSchema = z.infer<typeof expressionAnswerSchema>
