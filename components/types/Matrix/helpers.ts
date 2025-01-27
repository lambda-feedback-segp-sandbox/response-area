import _ from 'lodash'

import { matrixResponseAnswerSchema } from './Matrix.schema'

export type IMatrixResponse = Array<Array<string>>

export const padMatrixFromRowsAndCols = (args: {
  rows: number
  cols: number
  existing?: IMatrixResponse
}) => {
  const { rows, cols, existing = [] } = args
  const ids = _.fill<string>(Array(rows * cols), '')

  for (const [index] of ids.entries()) {
    const rowIndex = Math.floor(index / cols)
    const colIndex = index % cols
    const existingRow = existing[rowIndex] ?? []
    const existingValue = existingRow[colIndex]
    ids[index] = existingValue ?? ''
  }
  return _.chunk(ids, cols)
}

export const matrixFromJson = (args: {
  json: any
  rows: number
  cols: number
}) => {
  const { json, rows, cols } = args
  if (json) {
    const parsed = matrixResponseAnswerSchema.safeParse(json)
    if (parsed.success) {
      return padMatrixFromRowsAndCols({ rows, cols, existing: parsed.data })
    }
  }
  return padMatrixFromRowsAndCols({ rows, cols })
}
