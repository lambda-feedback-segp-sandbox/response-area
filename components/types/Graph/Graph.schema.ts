import { z } from 'zod'

export const graphConfigSchema = z.object({
  lowestX: z.number(),
  highestX: z.number(),
  lowestY: z.number(),
  highestY: z.number(),
  xScale: z.number(),
  yScale: z.number(),
  studentAxis: z.boolean(),
})

export type GraphConfigSchema = z.infer<typeof graphConfigSchema>

export const graphAnswerSchema = z.string()

export type GraphAnswerSchema = z.infer<typeof graphAnswerSchema>
