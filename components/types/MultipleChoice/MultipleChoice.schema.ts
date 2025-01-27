import { z } from 'zod'

export const multipleChoiceConfigSchema = z
  .object({
    options: z.array(z.string()),
    randomise: z.boolean(),
    single: z.boolean(),
  })
  .or(
    z
      .object({
        // legacy config schema. transformed to the new one
        options: z.array(z.string()),
        randomise: z.boolean(),
        type: z.enum(['MULTIPLE', 'ONE']),
      })
      .transform(value => ({
        options: value.options,
        randomise: value.randomise,
        single: value.type === 'ONE',
      })),
  )

export type MultipleChoiceConfigSchema = z.infer<
  typeof multipleChoiceConfigSchema
>

export const multipleChoiceAnswerSchema = z
  .array(z.boolean())
  .or(z.array(z.number()).transform(vals => vals.map(Boolean))) // legacy

export type MultipleChoiceAnswerSchema = z.infer<
  typeof multipleChoiceAnswerSchema
>
