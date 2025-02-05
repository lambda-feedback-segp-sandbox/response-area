import { ResponseAreaTub } from '@lambda-feedback/response-area-base'

import { CodeResponseAreaTub } from './Code'
import { EssayResponseAreaTub } from './Essay'
import { ExpressionResponseAreaTub } from './Expression'
import { GraphResponseAreaTub } from './Graph'
import { MatrixResponseAreaTub } from './Matrix'
import { MilkdownResponseAreaTub } from './Milkdown'
import { MultipleChoiceResponseAreaTub } from './MultipleChoice'
import { NumberResponseAreaTub } from './NumberInput'
import { NumericUnitsResponseAreaTub } from './NumericUnits'
import { TableResponseAreaTub } from './Table'
import { TextResponseAreaTub } from './TextInput'
import { TrueFalseResponseAreaTub } from './TrueFalse'

export const supportedResponseTypes = [
  'BOOLEAN',
  'TEXT',
  'NUMBER',
  'NUMERIC_UNITS',
  'MATRIX',
  'TABLE',
  'MULTIPLE_CHOICE',
  'GRAPH',
  'EXPRESSION',
  'ESSAY',
  'CODE',
  'MILKDOWN',
] as const

export type SupportedResponseType = (typeof supportedResponseTypes)[number]

const createReponseAreaTub = (type: string): ResponseAreaTub => {
  switch (type) {
    case 'BOOLEAN':
      return new TrueFalseResponseAreaTub()
    case 'TEXT':
      return new TextResponseAreaTub()
    case 'NUMBER':
      return new NumberResponseAreaTub()
    case 'NUMERIC_UNITS':
      return new NumericUnitsResponseAreaTub()
    case 'MATRIX':
      return new MatrixResponseAreaTub()
    case 'TABLE':
      return new TableResponseAreaTub()
    case 'MULTIPLE_CHOICE':
      return new MultipleChoiceResponseAreaTub()
    case 'GRAPH':
      return new GraphResponseAreaTub()
    case 'EXPRESSION':
      return new ExpressionResponseAreaTub()
    case 'ESSAY':
      return new EssayResponseAreaTub()
    case 'CODE':
      return new CodeResponseAreaTub()
    case 'MILKDOWN':
      return new MilkdownResponseAreaTub()
    default:
      throw new Error('Unknown response area Tub type: ' + type)
  }
}

export { createReponseAreaTub }
