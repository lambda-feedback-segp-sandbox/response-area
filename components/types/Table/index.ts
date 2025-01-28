import _ from 'lodash'
import { z } from 'zod'

import { ResponseAreaTub } from '../../../response-area-tub'
import {
  DEFAULT_COLS,
  DEFAULT_ROWS,
} from '../../../schemas/question-form.schema'
import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
} from '../base-props.type'
import { matrixFromJson, padMatrixFromRowsAndCols } from '../Matrix/helpers'

import { Table } from './Table.component'
import { tableConfigSchema, tableResponseAnswerSchema } from './Table.schema'
import { TableWizard } from './TableWizard.component'

export class TableResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'TABLE'

  protected configSchema = tableConfigSchema

  protected config?: z.infer<typeof tableConfigSchema>

  protected answerSchema = tableResponseAnswerSchema

  protected answer?: z.infer<typeof tableResponseAnswerSchema>

  public readonly displayWideInput = true

  initWithDefault = () => {
    this.config = {
      rows: DEFAULT_ROWS,
      cols: DEFAULT_COLS,
      rowNames: _.fill(new Array(DEFAULT_ROWS), ''),
      colNames: _.fill(new Array(DEFAULT_COLS), ''),
    }
    this.answer = padMatrixFromRowsAndCols({
      rows: DEFAULT_ROWS,
      cols: DEFAULT_COLS,
    })
  }

  protected extractAnswer = (provided: any): void => {
    if (!this.config) throw new Error('Config missing')
    if (!Array.isArray(provided)) throw new Error('Answer is not an array')

    // legacy handling: answer used to be stored as a one-dimensional array. This
    // checks which format the answer is in and converts it to a two-dimensional
    // array if necessary
    const isChuncked = Array.isArray(provided[0])
    let answerToParse: z.infer<typeof tableResponseAnswerSchema>
    if (isChuncked) {
      answerToParse = provided
    } else {
      answerToParse = _.chunk(provided, this.config.cols)
    }
    const parsedAnswer = this.answerSchema.safeParse(answerToParse)
    if (!parsedAnswer.success) throw new Error('Could not extract answer')

    this.answer = parsedAnswer.data
  }

  InputComponent = (props: BaseResponseAreaProps) => {
    if (!this.config) throw new Error('Config missing')

    const matrix = matrixFromJson({
      json: props.answer,
      rows: this.config.rows,
      cols: this.config.cols,
    })

    return Table({
      handleChange: args => props.handleChange(args.matrix),
      handleSubmit: props.handleSubmit,
      previewSubmit: props.previewSubmit,
      rows: this.config.rows,
      cols: this.config.cols,
      rowNames: this.config.rowNames,
      colNames: this.config.colNames,
      matrix,
    })
  }

  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    if (!this.config) throw new Error('Config missing')
    if (this.answer === undefined) throw new Error('Answer missing')

    return TableWizard({
      rows: this.config.rows,
      cols: this.config.cols,
      rowNames: this.config.rowNames,
      colNames: this.config.colNames,
      answer: this.answer,
      handleChange: props.handleChange,
    })
  }
}
