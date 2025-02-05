import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
  ResponseAreaTub,
} from '@lambda-feedback/response-area-base'

import { NumberInput } from './NumberInput.component'
import { numberResponseAnswerSchema } from './NumberInput.schema'

export class NumberResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'NUMBER'

  public readonly delegateErrorMessage = false

  protected answerSchema = numberResponseAnswerSchema

  protected answer?: number | null

  InputComponent = (props: BaseResponseAreaProps) => {
    const parsedAnswer = this.answerSchema.safeParse(props.answer)
    return NumberInput({
      ...props,
      answer: parsedAnswer.success ? parsedAnswer.data : undefined,
    })
  }

  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    return NumberInput({
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
