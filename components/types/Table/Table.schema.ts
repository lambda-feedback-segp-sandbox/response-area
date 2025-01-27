import { z } from 'zod'

export const tableConfigSchema = z
  .object({
    // legacy config schema. transformed to the new one
    shape: z.array(z.number()).length(2),
    rowNames: z.array(z.string()).min(1),
    colNames: z.array(z.string()).min(1),
  })
  .transform(data => {
    return {
      rows: data.shape[0]!,
      cols: data.shape[1]!,
      rowNames: data.rowNames,
      colNames: data.colNames,
    }
  })
  .or(
    z.object({
      rows: z.number(),
      cols: z.number(),
      rowNames: z.array(z.string()),
      colNames: z.array(z.string()),
    }),
  )

export type TableConfigSchema = z.infer<typeof tableConfigSchema>

export const tableResponseAnswerSchema = z.preprocess(
  val => {
    if (Array.isArray(val)) {
      return val.map(innerVal => {
        if (Array.isArray(innerVal)) {
          return innerVal.map(datum => {
            // this is being done for backwards compatibility
            if (typeof datum === 'number') return String(datum)
            // this is to prevent type incompatibility with jsonb
            if (datum === undefined) return ''
            return datum
          })
        }
        return innerVal
      })
    }
    return val
  },
  z.array(z.array(z.string())),
)
