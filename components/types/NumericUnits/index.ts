import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
  ResponseAreaTub,
} from '@lambda-feedback/response-area-base'
import { z } from 'zod'

import { NumericUnits } from './NumericUnits.component'

export class NumericUnitsResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'NUMERIC_UNITS'

  protected answerSchema = z.string()

  protected answer?: string

  InputComponent = (props: BaseResponseAreaProps) => {
    const parsedAnswer = this.answerSchema.safeParse(props.answer)
    return NumericUnits({
      ...props,
      answer: parsedAnswer.success ? parsedAnswer.data : undefined,
    })
  }

  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    return NumericUnits({
      ...props,
      handleChange: answer => {
        props.handleChange({
          responseType: this.responseType,
          answer,
        })
      },
      answer: this.answer,
    })
  }
}
